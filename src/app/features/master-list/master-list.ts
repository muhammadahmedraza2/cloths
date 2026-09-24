import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from '../../core/services/master-data.service';
import { Router } from '@angular/router';
import { FormDefinitionApi, MasterRecordApi } from '../../core/models/master-record.model';
import { CartService } from '../../core/services/Cart.Service';
import { AuthService } from '../../core/services/auth.service';
import { PageTitleService } from '../../core/services/page-title.service';
import { WishlistService } from '../../core/services/wishlist.service';

type FilterMode = 'both' | 'authorized' | 'unauthorized';

@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './master-list.html',
})
export class MasterListComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);

  formId!: number;
  config?: FormDefinitionApi;
  records: MasterRecordApi[] = [];
  configError = '';
  recordsError = '';

  // Add to cart / wishlist ke baad chhota message
  notice = '';
  noticeType: 'success' | 'danger' = 'success';
  private noticeTimer?: ReturnType<typeof setTimeout>;

  // Filter/search bar — Reactive Form (no two-way binding)
  filterForm = this.fb.nonNullable.group({
    filterMode: 'both' as FilterMode,
    searchTerm: '',
    pageSize: 10,
  });

  currentPage = 1;

  showModal = false;
  isEditing = false;
  editingId = '';
  recordForm: FormGroup = this.fb.group({});

  constructor(
    private route: ActivatedRoute,
    private masterData: MasterDataService,
    private cart: CartService,
    private router: Router,
    private auth: AuthService,
    private pageTitle: PageTitleService,
    private wishlist: WishlistService
  ) {}

  get loadError(): string {
    return this.configError || this.recordsError;
  }

  /** Add/Edit/Delete/Authorize/Export sirf Admin role ke liye. Normal user sirf browse + purchase kar sakta hai. */
  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  get ff() {
    return this.filterForm.controls;
  }

  get pageSize(): number {
    return this.filterForm.getRawValue().pageSize;
  }

  ngOnInit(): void {
    this.wishlist.load();

    this.route.paramMap.subscribe((params) => {
      this.formId = Number(params.get('formId'));

      // Purane form ka data/title naye form par nazar na aaye
      this.config = undefined;
      this.records = [];
      this.configError = '';
      this.recordsError = '';
      this.pageTitle.clear();

      // Normal user ko sirf Authorized (bikne wale) products dikhte hain
      this.filterForm.reset({
        filterMode: this.isAdmin ? 'both' : 'authorized',
        searchTerm: '',
        pageSize: 10,
      });
      this.currentPage = 1;
      this.loadConfig();
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.pageTitle.clear();
    clearTimeout(this.noticeTimer);
  }

  loadConfig(): void {
    const requestedFormId = this.formId;
    this.masterData.getFormDefinition(requestedFormId).subscribe({
      next: (cfg) => {
        if (requestedFormId !== this.formId) return; // user tab badal chuka hai
        this.config = cfg;
        this.pageTitle.set(cfg.title);
      },
      error: () => {
        if (requestedFormId !== this.formId) return;
        this.configError = 'Could not load this form. It may not exist or you may not have access.';
      },
    });
  }

  refresh(): void {
    const requestedFormId = this.formId;
    const { filterMode, searchTerm } = this.filterForm.getRawValue();
    const statusParam = filterMode === 'both' ? undefined : filterMode;
    this.masterData.getRecords(requestedFormId, statusParam, searchTerm || undefined).subscribe({
      next: (records) => {
        if (requestedFormId !== this.formId) return;
        this.records = records;
        this.recordsError = '';
      },
      error: () => {
        if (requestedFormId !== this.formId) return;
        this.recordsError = 'Could not load records. Please check your connection.';
      },
    });
  }

  get pagedRecords(): MasterRecordApi[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.records.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.records.length / this.pageSize));
  }

  get rangeLabel(): string {
    const total = this.records.length;
    if (total === 0) return '0 - 0 of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(total, this.currentPage * this.pageSize);
    return `${start} - ${end} of ${total}`;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.refresh();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.refresh();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  /** Config ke columns se dynamic FormGroup banata hai (sirf Admin ke Add/Edit modal ke liye). */
  private buildRecordForm(initial: Record<string, any>): FormGroup {
    const group: Record<string, any> = {};
    this.config?.columns.forEach((c) => {
      group[c.key] = [initial[c.key] ?? ''];
    });
    group['closed'] = [initial['closed'] ?? 'N'];
    return this.fb.group(group);
  }

  openAddNew(): void {
    if (!this.config || !this.isAdmin) return;
    this.isEditing = false;
    this.recordForm = this.buildRecordForm({});
    this.showModal = true;
  }

  selectRow(record: MasterRecordApi): void {
    if (!this.isAdmin) return; // user ke liye row click se edit modal nahi khulta
    this.isEditing = true;
    this.editingId = record.id;
    this.recordForm = this.buildRecordForm({ ...record.fields, closed: record.closed });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRecord(): void {
    if (!this.config) return;
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    const { closed, ...fields } = this.recordForm.getRawValue();
    const dto = { closed, fields };

    const save$ = this.isEditing
      ? this.masterData.updateRecord(this.formId, this.editingId, dto)
      : this.masterData.createRecord(this.formId, dto);

    save$.subscribe({
      next: () => {
        this.showModal = false;
        this.refresh();
      },
      error: () => alert('Save failed. Please try again.'),
    });
  }

  authorizeRow(record: MasterRecordApi, evt: Event): void {
    evt.stopPropagation();
    if (!this.isAdmin) return;
    this.masterData.authorizeRecord(this.formId, record.id).subscribe({
      next: () => this.refresh(),
      error: () => alert('Authorize failed.'),
    });
  }

  deleteRow(record: MasterRecordApi, evt: Event): void {
    evt.stopPropagation();
    if (!this.isAdmin) return;
    if (!confirm(`Delete "${record.fields['name'] || record.fields['code'] || record.id}"?`)) return;

    this.masterData.deleteRecord(this.formId, record.id).subscribe({
      next: () => this.refresh(),
      error: () => alert('Delete failed.'),
    });
  }

  // ------------------------- Shop (cart / wishlist) -------------------------

  /** Record mein valid price ho to woh "product" hai (Product Setup jaisi forms). */
  isShoppable(record: MasterRecordApi): boolean {
    const price = record.fields['price'];
    return price !== undefined && price !== null && price !== '' && !isNaN(Number(price));
  }

  /** User sirf Authorized aur open (closed != Y) product khareed sakta hai. */
  canBuy(record: MasterRecordApi): boolean {
    if (!this.isShoppable(record)) return false;
    return this.isAdmin || (record.status === 'Authorized' && record.closed !== 'Y');
  }

  get showShopActions(): boolean {
    return this.records.some((r) => this.isShoppable(r));
  }

  get showImageColumn(): boolean {
    return this.showShopActions || this.records.some((r) => !!r.fields['imageUrl']);
  }

  /** Table ke "No records" row ke liye columns ki ginti. */
  get colSpan(): number {
    const adminColumns = this.isAdmin ? 4 : 0; // Select, Status, Closed, actions
    return (
      (this.config?.columns.length ?? 0) +
      (this.showImageColumn ? 1 : 0) +
      (this.showShopActions ? 1 : 0) +
      adminColumns
    );
  }

  private productName(record: MasterRecordApi): string {
    return record.fields['name'] || record.fields['code'] || 'Item';
  }

  addToCart(record: MasterRecordApi, goToCart: boolean, evt?: Event): void {
    evt?.stopPropagation();
    if (!this.canBuy(record)) return;

    this.cart
      .addToCart({
        productId: record.id,
        name: this.productName(record),
        imageUrl: record.fields['imageUrl'] || undefined,
        price: Number(record.fields['price']),
      })
      .subscribe({
        next: () => {
          if (goToCart) {
            this.router.navigate(['/app/cart']);
          } else {
            this.showNotice(`${this.productName(record)} added to your cart.`, 'success');
          }
        },
        error: () => this.showNotice('Could not add to cart. Please try again.', 'danger'),
      });
  }

  /** Product ki image par click = cart mein daalo aur cart page kholo. */
  onImageClick(record: MasterRecordApi, evt: Event): void {
    this.addToCart(record, true, evt);
  }

  isWished(record: MasterRecordApi): boolean {
    return this.wishlist.has(record.id);
  }

  toggleWish(record: MasterRecordApi, evt: Event): void {
    evt.stopPropagation();
    if (!this.isShoppable(record)) return;

    const wasWished = this.isWished(record);
    this.wishlist.toggle({
      productId: record.id,
      name: this.productName(record),
      imageUrl: record.fields['imageUrl'] || undefined,
      price: Number(record.fields['price']),
    });
    this.showNotice(
      wasWished
        ? `${this.productName(record)} removed from your wishlist.`
        : `${this.productName(record)} saved to your wishlist.`,
      'success'
    );
  }

  private showNotice(message: string, type: 'success' | 'danger'): void {
    this.notice = message;
    this.noticeType = type;
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => (this.notice = ''), 2500);
  }

  /** xlsx library bhaari hai, is liye sirf export dabane par load hoti hai (app jaldi khulti hai). */
  async exportToExcel(): Promise<void> {
    if (!this.config || !this.isAdmin) return;
    const XLSX = await import('xlsx');
    const data = this.records.map((r) => {
      const row: Record<string, any> = {};
      this.config!.columns.forEach((c) => (row[c.label] = r.fields[c.key]));
      row['Status'] = r.status;
      row['Closed'] = r.closed;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.config.title.substring(0, 30));
    XLSX.writeFile(wb, `${this.config.title.replace(/\s+/g, '_')}.xlsx`);
  }
}

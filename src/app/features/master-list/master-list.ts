import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { MasterDataService } from '../../core/services/master-data.service';
import { Router } from '@angular/router';
import { FormDefinitionApi, MasterRecordApi } from '../../core/models/master-record.model';
import { CartService } from '../../core/services/Cart.Service';
import { AuthService } from '../../core/services/auth.service';

type FilterMode = 'both' | 'authorized' | 'unauthorized';

@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './master-list.html',
})
export class MasterListComponent implements OnInit {
  private fb = inject(FormBuilder);

  formId!: number;
  config?: FormDefinitionApi;
  records: MasterRecordApi[] = [];
  loadError = '';

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
    private auth: AuthService
  ) {}

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
    this.route.paramMap.subscribe((params) => {
      this.formId = Number(params.get('formId'));
      this.filterForm.reset({ filterMode: 'both', searchTerm: '', pageSize: 10 });
      this.currentPage = 1;
      this.loadConfig();
      this.refresh();
    });
  }

  loadConfig(): void {
    this.masterData.getFormDefinition(this.formId).subscribe({
      next: (cfg) => (this.config = cfg),
      error: () => (this.loadError = 'Could not load form definition.'),
    });
  }

  refresh(): void {
    const { filterMode, searchTerm } = this.filterForm.getRawValue();
    const statusParam = filterMode === 'both' ? undefined : filterMode;
    this.masterData.getRecords(this.formId, statusParam, searchTerm || undefined).subscribe({
      next: (records) => {
        this.records = records;
        this.loadError = '';
      },
      error: () => (this.loadError = 'Could not load records. Please check your connection.'),
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

  /** Clicking a product image/placeholder adds it to the cart and jumps there (Admin aur User dono kar sakte hain). */
  onImageClick(record: MasterRecordApi, evt: Event): void {
    evt.stopPropagation();
    this.cart.addToCart({
      productId: record.id,
      name: record.fields['name'] || record.fields['code'] || 'Item',
      imageUrl: record.fields['imageUrl'] || undefined,
      price: Number(record.fields['price']) || 0,
    }).subscribe({
      next: () => this.router.navigate(['/app/cart']),
      error: () => alert('Could not add to cart.'),
    });
  }

  exportToExcel(): void {
    if (!this.config || !this.isAdmin) return;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormRegistryService } from '../../core/services/form-registry.service';
import { DataStoreService } from '../../core/services/data-store.service';
import { MasterFormConfig, MasterRecord } from '../../core/models/form-config.model';
import { CartService } from '../../core/services/Cart.Service';

type FilterMode = 'both' | 'authorized' | 'unauthorized';

@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-list.html',
})
export class MasterListComponent implements OnInit {
  config?: MasterFormConfig;
  records: MasterRecord[] = [];

  filterMode: FilterMode = 'both';
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;

  showModal = false;
  isEditing = false;
  formModel: Record<string, any> = {};

  constructor(
    private route: ActivatedRoute,
    private registry: FormRegistryService,
    private store: DataStoreService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const formId = Number(params.get('formId'));
      this.config = this.registry.getById(formId);
      this.filterMode = 'both';
      this.searchTerm = '';
      this.currentPage = 1;
      this.refresh();
    });
  }

  refresh(): void {
    if (!this.config) return;
    this.records = this.store.getRecords(this.config.formId);
  }

onImageClick(row: MasterRecord, evt: Event): void {
  evt.stopPropagation();
  this.cart.addToCart({
    id: row.id,
    name: row['name'] || row['code'],
    imageUrl: row['imageUrl'],
    price: Number(row['price']) || 0,
  });
  this.router.navigate(['/app/cart']);
}

  get filteredRecords(): MasterRecord[] {
    let list = [...this.records];
    if (this.filterMode === 'authorized') {
      list = list.filter((r) => r.status === 'Authorized');
    } else if (this.filterMode === 'unauthorized') {
      list = list.filter((r) => r.status === 'UnAuthorize');
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((v) => String(v ?? '').toLowerCase().includes(term))
      );
    }
    return list;
  }

  get pagedRecords(): MasterRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecords.length / this.pageSize));
  }

  get rangeLabel(): string {
    const total = this.filteredRecords.length;
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
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  openAddNew(): void {
    if (!this.config) return;
    this.isEditing = false;
    const blank: Record<string, any> = {};
    this.config.columns.forEach((c) => (blank[c.key] = ''));
    blank['closed'] = 'N';
    this.formModel = blank;
    this.showModal = true;
  }

  selectRow(record: MasterRecord): void {
    this.isEditing = true;
    this.formModel = { ...record };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRecord(): void {
    if (!this.config) return;
    if (this.isEditing) {
      const updated: MasterRecord = {
        ...(this.formModel as MasterRecord),
      };
      this.store.updateRecord(this.config.formId, updated);
    } else {
      const newRecord: MasterRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        status: 'UnAuthorize',
        closed: this.formModel['closed'] || 'N',
        ...this.formModel,
      };
      this.store.addRecord(this.config.formId, newRecord);
    }
    this.showModal = false;
    this.refresh();
  }

  authorizeRow(record: MasterRecord, evt: Event): void {
    evt.stopPropagation();
    if (!this.config) return;
    const updated: MasterRecord = { ...record, status: 'Authorized' };
    this.store.updateRecord(this.config.formId, updated);
    this.refresh();
  }

  deleteRow(record: MasterRecord, evt: Event): void {
    evt.stopPropagation();
    if (!this.config) return;
    if (confirm(`Delete "${record['name'] || record['code'] || record.id}"?`)) {
      this.store.deleteRecord(this.config.formId, record.id);
      this.refresh();
    }
  }

  exportToExcel(): void {
    if (!this.config) return;
    const data = this.filteredRecords.map((r) => {
      const row: Record<string, any> = {};
      this.config!.columns.forEach((c) => (row[c.label] = r[c.key]));
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

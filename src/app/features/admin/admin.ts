import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopService } from '../../core/services/shop.service';
import { Product, Category, Brand, Size, Color, AgeGroup, UserSummary, Payment, Supplier, Order } from '../../core/models/shop.model';

interface NavItem { key: string; label: string; live: boolean; }
interface NavGroup { label: string; icon: string; items: NavItem[]; }

// Requested shop category tree. Category model has no parent/child field yet,
// so "Quick Add" below flattens each leaf into one Category record
// named "Parent - Child" (e.g. "Women - Frock"). Real nested categories
// need a `parentCategoryId` column added on the backend Category table.
const CATEGORY_TREE: { parent: string; children: string[] }[] = [
  { parent: 'Women', children: ['Frock', '2 Piece', '3 Piece'] },
  { parent: 'Men', children: ['Kurta', 'Shirt', 'Trouser'] },
  { parent: 'Girls', children: ['Frock', '2 Piece', '3 Piece'] },
  { parent: 'Boys', children: ['Shirt', 'Trouser', '2 Piece'] },
  { parent: 'Baby', children: ['Baby Collection'] },
];

const LOCAL_KEY = 'admin_local_setup_v1';

@Component({ selector: 'app-admin', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule, DecimalPipe], templateUrl: './admin.html' })
export class AdminComponent implements OnInit {
  api = inject(ShopService); private fb = inject(FormBuilder);

  // ---------- Sidebar navigation (matches the requested menu tree) ----------
  categoryTree = CATEGORY_TREE;

  navGroups: NavGroup[] = [
    {
      label: 'Sales Management', icon: 'bi-cart-check', items: [
        { key: 'sales-order', label: 'Sales Order', live: true },
        { key: 'sales-invoice', label: 'Sales Invoice', live: true },
        { key: 'sales-return', label: 'Sales Return', live: true },
        { key: 'customer-ledger', label: 'Customer Ledger', live: true },
        { key: 'payments', label: 'Payments', live: true },
      ]
    },
    {
      label: 'Purchase Management', icon: 'bi-truck', items: [
        { key: 'supplier-setup', label: 'Supplier Setup', live: true },
        { key: 'purchase-order', label: 'Purchase Order', live: false },
        { key: 'purchase-invoice', label: 'Purchase Invoice', live: true },
        { key: 'purchase-return', label: 'Purchase Return', live: false },
      ]
    },
    {
      label: 'Setup Management', icon: 'bi-gear', items: [
        { key: 'company-setup', label: 'Company Setup', live: true },
        { key: 'category-setup', label: 'Category Setup', live: true },
        { key: 'brand-setup', label: 'Brand Setup', live: true },
        { key: 'product-setup', label: 'Product Setup', live: true },
        { key: 'size-setup', label: 'Size Setup', live: true },
        { key: 'color-setup', label: 'Color Setup', live: true },
        { key: 'uom-setup', label: 'Unit Of Measure', live: true },
        { key: 'warehouse-setup', label: 'Warehouse Setup', live: true },
        { key: 'customer-setup', label: 'Customer Setup', live: true },
      ]
    },
    {
      label: 'Inventory Management', icon: 'bi-boxes', items: [
        { key: 'stock-overview', label: 'Stock Overview', live: true },
        { key: 'stock-in', label: 'Stock In', live: true },
        { key: 'stock-out', label: 'Stock Out', live: false },
        { key: 'stock-transfer', label: 'Stock Transfer', live: false },
        { key: 'stock-adjustment', label: 'Stock Adjustment', live: false },
      ]
    },
    {
      label: 'Reports', icon: 'bi-bar-chart', items: [
        { key: 'sales-report', label: 'Sales Report', live: true },
        { key: 'purchase-report', label: 'Purchase Report', live: false },
        { key: 'stock-report', label: 'Stock Report', live: true },
        { key: 'customer-report', label: 'Customer Report', live: true },
      ]
    },
    {
      label: 'Users & Access', icon: 'bi-people', items: [
        { key: 'users', label: 'Users', live: true },
      ]
    },
  ];

  view = 'dashboard';

  // The app already has a left sidebar with these same group names (driven by
  // the backend /Menu). Repeating it as a second vertical sidebar inside the
  // Admin Console looked like a duplicate menu, so navigation here is a
  // horizontal group-then-item tab strip instead.
  activeGroupLabel = '';

  get activeGroupItems(): NavItem[] {
    return this.navGroups.find(g => g.label === this.activeGroupLabel)?.items ?? [];
  }

  selectGroup(g: NavGroup) {
    this.activeGroupLabel = g.label;
    this.setView(g.items[0].key);
  }

  setView(key: string) {
    this.view = key; this.message = ''; this.error = '';
    if (['sales-order', 'sales-invoice', 'sales-return', 'customer-ledger', 'sales-report', 'customer-report'].includes(key)) this.loadOrdersIfNeeded();
  }

  // ---------- Existing data / forms ----------
  dashboard: any; products: Product[] = []; categories: Category[] = []; brands: Brand[] = []; sizes: Size[] = []; colors: Color[] = []; ages: AgeGroup[] = []; users: UserSummary[] = []; payments: Payment[] = []; suppliers: Supplier[] = [];
  error = ''; message = ''; editingProduct?: Product;

  productForm = this.fb.group({
    productName: ['', Validators.required],
    sku: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    brandId: [null as string | null],
    gender: [0],
    ageGroupId: [null as string | null],
    fabric: [''],
    season: [''],
    purchasePrice: [0, [Validators.required, Validators.min(0)]],
    salePrice: [0, [Validators.required, Validators.min(0)]],
    discount: [0, Validators.min(0)],
    minimumStockLevel: [0, Validators.min(0)],
    isActive: [true],
    variants: this.fb.array<any>([])
  });
  masterForm = this.fb.nonNullable.group({ name: ['', Validators.required], description: [''], ageRange: [''], hexCode: [''], minAgeMonths: [0], maxAgeMonths: [0], isActive: true });
  supplierForm = this.fb.nonNullable.group({ name: ['', Validators.required], phone: [''], email: [''], address: [''], isActive: true });
  purchaseForm = this.fb.nonNullable.group({ supplierId: ['', Validators.required], invoiceNumber: [''], purchaseDate: [new Date().toISOString().slice(0, 10), Validators.required], paymentStatus: [0], notes: [''], productVariantId: ['', Validators.required], quantity: [1, [Validators.required, Validators.min(1)]], purchasePrice: [0, [Validators.required, Validators.min(0)]] });

  get variants() { return this.productForm.controls.variants as FormArray; }

  // ---------- Product images (real file upload, no imageUrls text boxes) ----------
  // NOTE: there is no dedicated "upload product image" endpoint on the backend yet
  // (only /payment-proof/upload exists, for payment screenshots). So new images are
  // read as base64 data URLs on the client and sent inside Product.images as strings.
  // That works end-to-end today, but for real production use it's better to add a
  // proper /admin/products/images upload endpoint that returns a hosted URL.
  existingImagePreviews: string[] = []; // images already saved on the product being edited
  imagePreviews: string[] = [];         // newly selected images (base64), not yet saved
  imageError = '';
  private readonly MAX_IMAGE_MB = 5;

  onImageSelect(event: Event) {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    for (const file of files) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        this.imageError = `"${file.name}" is not a PNG/JPEG/WEBP image.`;
        continue;
      }
      if (file.size > this.MAX_IMAGE_MB * 1024 * 1024) {
        this.imageError = `"${file.name}" is larger than ${this.MAX_IMAGE_MB}MB.`;
        continue;
      }

      const reader = new FileReader();
      reader.onload = () => this.imagePreviews.push(reader.result as string);
      reader.onerror = () => this.imageError = `Could not read "${file.name}".`;
      reader.readAsDataURL(file);
    }

    input.value = ''; // allow re-selecting the same file later
  }

  removeImage(i: number) { this.imagePreviews.splice(i, 1); }
  removeExistingImage(i: number) { this.existingImagePreviews.splice(i, 1); }

  ngOnInit() { this.loadAll(); this.loadLocal(); }

  loadAll() { this.api.adminDashboard().subscribe(x => this.dashboard = x); this.api.products().subscribe(x => this.products = x); this.api.categories().subscribe(x => this.categories = x); this.api.brands().subscribe(x => this.brands = x); this.api.sizes().subscribe(x => this.sizes = x); this.api.colors().subscribe(x => this.colors = x); this.api.ageGroups().subscribe(x => this.ages = x); this.api.adminUsers().subscribe(x => this.users = x); this.api.payments().subscribe(x => this.payments = x); this.api.suppliers().subscribe(x => this.suppliers = x); }

  editProduct(p: Product) {
    this.editingProduct = p;

    this.productForm.patchValue({
      productName: p.productName,
      sku: p.sku,
      description: p.description ?? '',
      categoryId: p.categoryId,
      brandId: p.brandId ?? null,
      gender: p.gender,
      ageGroupId: p.ageGroupId ?? null,
      fabric: p.fabric ?? '',
      season: p.season ?? '',
      purchasePrice: p.purchasePrice,
      salePrice: p.salePrice,
      discount: p.discount,
      minimumStockLevel: p.minimumStockLevel,
      isActive: p.isActive
    });

    this.existingImagePreviews = [...(p.images ?? [])];
    this.imagePreviews = [];
    this.imageError = '';

    this.variants.clear();

    (p.variants ?? []).forEach(v => this.addVariant(v));
  }
  newProduct() {
    this.editingProduct = undefined;

    this.productForm.reset({
      productName: '',
      sku: '',
      description: '',
      categoryId: '',
      brandId: null,
      gender: 0,
      ageGroupId: null,
      fabric: '',
      season: '',
      purchasePrice: 0,
      salePrice: 0,
      discount: 0,
      minimumStockLevel: 0,
      isActive: true
    });

    this.existingImagePreviews = [];
    this.imagePreviews = [];
    this.imageError = '';
    this.variants.clear();
  }
  addVariant(v?: any) { this.variants.push(this.fb.group({ sizeId: [v?.sizeId ?? '', Validators.required], colorId: [v?.colorId ?? '', Validators.required], sku: [v?.sku ?? '', Validators.required], purchasePrice: [v?.purchasePrice ?? 0, Validators.min(0)], salePrice: [v?.salePrice ?? 0, Validators.min(0)], stockQuantity: [v?.stockQuantity ?? 0, [Validators.required, Validators.min(1)]], minimumStockLevel: [v?.minimumStockLevel ?? 0, Validators.min(0)], isActive: [v?.isActive ?? true] })); }
  removeVariant(i: number) { this.variants.removeAt(i) }
  saveProduct() {
    if (this.productForm.invalid || this.variants.length === 0) { this.productForm.markAllAsTouched(); this.error = this.variants.length === 0 ? 'Add at least one variant with stock.' : ''; return; }
    const v = this.productForm.getRawValue();
    const dto = {
      ...v,
      imageUrls: [
        ...this.existingImagePreviews,
        ...this.imagePreviews
      ]
    };
    this.api.saveProduct(dto, this.editingProduct?.id).subscribe({ next: () => { this.message = 'Product saved successfully.'; this.loadAll(); this.newProduct(); }, error: (e: any) => this.error = e?.error?.message || 'Product save failed.' });
  }
  deleteProduct(p: Product) { if (!confirm(`Deactivate ${p.productName}?`)) return; this.api.deleteProduct(p.id).subscribe(() => this.loadAll()); }

  saveMaster(type: string) {
    if (this.masterForm.invalid) return; const v = this.masterForm.getRawValue(); let req: any;
    if (type === 'category') req = this.api.saveCategory({ name: v.name, description: v.description, isActive: v.isActive });
    if (type === 'brand') req = this.api.saveBrand({ name: v.name, isActive: v.isActive });
    if (type === 'size') req = this.api.saveSize({ name: v.name, ageRange: v.ageRange, isActive: v.isActive });
    if (type === 'color') req = this.api.saveColor({ name: v.name, hexCode: v.hexCode, isActive: v.isActive });
    if (type === 'age') req = this.api.saveAgeGroup({ name: v.name, minAgeMonths: v.minAgeMonths, maxAgeMonths: v.maxAgeMonths, isActive: v.isActive });
    req.subscribe({ next: () => { this.message = `${type} added successfully.`; this.masterForm.reset({ name: '', description: '', ageRange: '', hexCode: '', minAgeMonths: 0, maxAgeMonths: 0, isActive: true }); this.loadAll(); }, error: (e: any) => this.error = e?.error?.message || 'Save failed.' });
  }

  // Quick-add one leaf of the requested category tree as "Parent - Child"
  quickAddCategory(parent: string, child?: string) {
    const name = child ? `${parent} - ${child}` : parent;
    if (this.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) { this.message = `"${name}" already exists.`; return; }
    this.api.saveCategory({ name, description: '', isActive: true }).subscribe({ next: () => { this.message = `Category "${name}" added.`; this.loadAll(); }, error: (e: any) => this.error = e?.error?.message || 'Save failed.' });
  }
  quickAddAllCategories() {
    const names: string[] = [];
    for (const g of this.categoryTree) { names.push(g.parent); for (const c of g.children) names.push(`${g.parent} - ${c}`); }
    const toAdd = names.filter(n => !this.categories.some(c => c.name.toLowerCase() === n.toLowerCase()));
    if (!toAdd.length) { this.message = 'All suggested categories already exist.'; return; }
    let done = 0;
    toAdd.forEach(name => this.api.saveCategory({ name, description: '', isActive: true }).subscribe(() => { done++; if (done === toAdd.length) { this.message = `${done} categories added.`; this.loadAll(); } }));
  }

  toggleUser(u: UserSummary) { this.api.setUserActive(u.id, !u.isActive).subscribe(() => { u.isActive = !u.isActive; }); }
  updatePayment(p: Payment, e: Event) { const status = Number((e.target as HTMLSelectElement).value); this.api.updatePaymentStatus(p.id, status).subscribe(() => this.loadAll()); }
  saveSupplier() { if (this.supplierForm.invalid) return; this.api.saveSupplier(this.supplierForm.getRawValue()).subscribe({ next: () => { this.message = 'Supplier saved.'; this.supplierForm.reset({ name: '', phone: '', email: '', address: '', isActive: true }); this.loadAll(); }, error: (e: any) => this.error = e?.error?.message || 'Supplier save failed.' }); }
  createPurchase() { if (this.purchaseForm.invalid) return; const v = this.purchaseForm.getRawValue(); this.api.createPurchase({ supplierId: v.supplierId, invoiceNumber: v.invoiceNumber || undefined, purchaseDate: v.purchaseDate, paymentStatus: v.paymentStatus, notes: v.notes, items: [{ productVariantId: v.productVariantId, quantity: v.quantity, purchasePrice: v.purchasePrice }] }).subscribe({ next: () => { this.message = 'Purchase created and stock increased.'; this.loadAll(); }, error: (e: any) => this.error = e?.error?.message || 'Purchase failed.' }); }

  // ---------- Sales (reuses existing /admin/orders endpoints) ----------
  orders: Order[] = []; ordersLoaded = false;
  loadOrdersIfNeeded() { if (this.ordersLoaded) return; this.api.adminOrders().subscribe(o => { this.orders = o; this.ordersLoaded = true; }); }
  refreshOrders() { this.ordersLoaded = false; this.loadOrdersIfNeeded(); }
  setOrderStatus(o: Order, e: Event) { const status = Number((e.target as HTMLSelectElement).value); this.api.updateOrderStatus(o.id, status).subscribe(() => { o.orderStatus = status; }); }
  orderStatusLabels = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  selectedOrderId = ''; invoiceData: any;
  viewInvoice(id: string) { this.selectedOrderId = id; this.invoiceData = undefined; this.api.invoice(id).subscribe(x => this.invoiceData = x); }

  get returnedOrders() { return this.orders.filter(o => o.orderStatus === 7); }

  get customerLedger() {
    const map = new Map<string, { name: string; orders: number; total: number }>();
    this.orders.forEach(o => { const key = o.customerName || 'Unknown'; const e = map.get(key) || { name: key, orders: 0, total: 0 }; e.orders++; e.total += o.finalAmount; map.set(key, e); });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }

  get salesReportSummary() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders.reduce((s, o) => s + o.finalAmount, 0);
    const byStatus = this.orderStatusLabels.map((label, i) => ({ label, count: this.orders.filter(o => o.orderStatus === i).length }));
    return { totalOrders, totalRevenue, avgOrder: totalOrders ? totalRevenue / totalOrders : 0, byStatus };
  }

  // ---------- Inventory (derived from existing product/variant data) ----------
  get stockRows() {
    return this.products.flatMap(p => p.variants.map(v => ({ product: p.productName, sku: v.sku, size: v.sizeName, color: v.colorName, stock: v.stockQuantity, minStock: v.minimumStockLevel, low: v.stockQuantity <= v.minimumStockLevel })));
  }
  get lowStockRows() { return this.stockRows.filter(r => r.low); }

  // ---------- Local-only setup (Company / UOM / Warehouse / Walk-in Customers) ----------
  // These have no backend table yet, so they persist to this browser only.
  local: { company: { name: string; address: string; phone: string; ntn: string }; uom: string[]; warehouses: string[]; walkInCustomers: { name: string; phone: string }[] } = { company: { name: '', address: '', phone: '', ntn: '' }, uom: [], warehouses: [], walkInCustomers: [] };
  newUom = ''; newWarehouse = ''; newWalkInName = ''; newWalkInPhone = '';

  loadLocal() { try { const raw = localStorage.getItem(LOCAL_KEY); if (raw) this.local = { ...this.local, ...JSON.parse(raw) }; } catch { } }
  saveLocal() { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(this.local)); } catch { } }

  saveCompany() { this.saveLocal(); this.message = 'Company profile saved on this device.'; }
  addUom() { const v = this.newUom.trim(); if (!v) return; this.local.uom.push(v); this.newUom = ''; this.saveLocal(); }
  removeUom(i: number) { this.local.uom.splice(i, 1); this.saveLocal(); }
  addWarehouse() { const v = this.newWarehouse.trim(); if (!v) return; this.local.warehouses.push(v); this.newWarehouse = ''; this.saveLocal(); }
  removeWarehouse(i: number) { this.local.warehouses.splice(i, 1); this.saveLocal(); }
  addWalkInCustomer() { const n = this.newWalkInName.trim(); if (!n) return; this.local.walkInCustomers.push({ name: n, phone: this.newWalkInPhone.trim() }); this.newWalkInName = ''; this.newWalkInPhone = ''; this.saveLocal(); }
  removeWalkInCustomer(i: number) { this.local.walkInCustomers.splice(i, 1); this.saveLocal(); }
}
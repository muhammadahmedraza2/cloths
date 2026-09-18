import { Injectable } from '@angular/core';
import { MasterFormConfig, MasterRecord } from '../models/form-config.model';

function rec(id: string, extra: Record<string, any>, status: 'Authorized' | 'UnAuthorize', closed: 'Y' | 'N'): MasterRecord {
  return { id, status, closed, ...extra };
}

@Injectable({ providedIn: 'root' })
export class FormRegistryService {
  private registry: Record<number, MasterFormConfig> = {

    // ---------- SETUP MANAGEMENT ----------
    1047: {
      formId: 1047,
      title: 'Stationery Setup',
      breadcrumb: 'Setup Management / Product Setup / Stationery Setup',
      columns: [
        { key: 'code', label: 'Stationery Code' },
        { key: 'name', label: 'Stationery Name' },
        { key: 'instrumentId', label: 'Instrument Id' },
        { key: 'instrumentDesc', label: 'INSTRUMENT_DESC' },
      ],
      seedData: [
        rec('1', { code: '03123', name: 'RAZA STATIONARY SETUP', instrumentId: 'MK17', instrumentDesc: 'MK17' }, 'UnAuthorize', 'N'),
        rec('2', { code: '', name: '', instrumentId: '', instrumentDesc: '' }, 'Authorized', 'N'),
        rec('3', { code: '12345', name: 'Shoaib', instrumentId: 'MK17', instrumentDesc: 'MK17' }, 'UnAuthorize', 'Y'),
        rec('4', { code: 'ts01', name: 'testing', instrumentId: 'MK17', instrumentDesc: 'MK17' }, 'UnAuthorize', 'Y'),
        rec('5', { code: 'SC_KK', name: 'ayan', instrumentId: '', instrumentDesc: '' }, 'Authorized', 'N'),
      ],
    },

    1101: {
      formId: 1101,
      title: 'Company Setup',
      breadcrumb: 'Setup Management / Company Setup',
      columns: [
        { key: 'code', label: 'Company Code' },
        { key: 'name', label: 'Company Name' },
        { key: 'city', label: 'City' },
        { key: 'ntn', label: 'NTN' },
      ],
      seedData: [
        rec('1', { code: 'CMP01', name: 'CRPL Textiles Pvt Ltd', city: 'Karachi', ntn: '1234567-8' }, 'Authorized', 'N'),
        rec('2', { code: 'CMP02', name: 'Little Threads (Pvt) Ltd', city: 'Lahore', ntn: '9876543-1' }, 'UnAuthorize', 'N'),
      ],
    },

    1102: {
      formId: 1102,
      title: 'Product Setup',
      breadcrumb: 'Setup Management / Product Setup',
      columns: [
        { key: 'code', label: 'Product Code' },
        { key: 'name', label: 'Product Name' },
        { key: 'category', label: 'Category' },
        { key: 'uom', label: 'UOM' },
      ],
      seedData: [
        rec('1', { code: 'PRD001', name: 'Kids Winter Jacket', category: "Kids Wear", uom: 'PCS' }, 'Authorized', 'N'),
        rec('2', { code: 'PRD002', name: "Men's Formal Shirt", category: "Men Wear", uom: 'PCS' }, 'Authorized', 'N'),
        rec('3', { code: 'PRD003', name: "Women's Lawn Suit", category: "Women Wear", uom: 'SET' }, 'UnAuthorize', 'N'),
        rec('4', { code: 'PRD004', name: 'Newborn Romper', category: "Kids Wear", uom: 'PCS' }, 'UnAuthorize', 'N'),
      ],
    },

    1103: {
      formId: 1103,
      title: 'Bank Setup',
      breadcrumb: 'Setup Management / Bank Setup',
      columns: [
        { key: 'code', label: 'Bank Code' },
        { key: 'name', label: 'Bank Name' },
        { key: 'branch', label: 'Branch' },
        { key: 'account', label: 'Account No' },
      ],
      seedData: [
        rec('1', { code: 'BNK01', name: 'Meezan Bank', branch: 'Gulshan-e-Iqbal', account: '01234567890' }, 'Authorized', 'N'),
        rec('2', { code: 'BNK02', name: 'HBL', branch: 'Defence', account: '09876543210' }, 'UnAuthorize', 'N'),
      ],
    },

    1104: {
      formId: 1104,
      title: 'Geographical Setup',
      breadcrumb: 'Setup Management / Geographical Setup',
      columns: [
        { key: 'code', label: 'Region Code' },
        { key: 'name', label: 'Region / City' },
        { key: 'country', label: 'Country' },
      ],
      seedData: [
        rec('1', { code: 'KHI', name: 'Karachi', country: 'Pakistan' }, 'Authorized', 'N'),
        rec('2', { code: 'LHR', name: 'Lahore', country: 'Pakistan' }, 'Authorized', 'N'),
        rec('3', { code: 'ISB', name: 'Islamabad', country: 'Pakistan' }, 'UnAuthorize', 'N'),
      ],
    },

    1105: {
      formId: 1105,
      title: 'Signatory Management',
      breadcrumb: 'Setup Management / Signatory Management',
      columns: [
        { key: 'code', label: 'Signatory Code' },
        { key: 'name', label: 'Signatory Name' },
        { key: 'designation', label: 'Designation' },
      ],
      seedData: [
        rec('1', { code: 'SIG01', name: 'Ahmed Raza', designation: 'Finance Manager' }, 'Authorized', 'N'),
        rec('2', { code: 'SIG02', name: 'Ayesha Khan', designation: 'Operations Head' }, 'UnAuthorize', 'N'),
      ],
    },

    1106: {
      formId: 1106,
      title: 'Courier / Security Setup',
      breadcrumb: 'Setup Management / Courier-Security Setup',
      columns: [
        { key: 'code', label: 'Courier Code' },
        { key: 'name', label: 'Courier Name' },
        { key: 'contact', label: 'Contact No' },
      ],
      seedData: [
        rec('1', { code: 'CUR01', name: 'TCS Express', contact: '021-111827827' }, 'Authorized', 'N'),
        rec('2', { code: 'CUR02', name: 'Leopards Courier', contact: '021-111300005' }, 'Authorized', 'N'),
      ],
    },

    1107: {
      formId: 1107,
      title: 'Application Setup',
      breadcrumb: 'Setup Management / Application Setup',
      columns: [
        { key: 'code', label: 'App Code' },
        { key: 'name', label: 'Application Name' },
        { key: 'version', label: 'Version' },
      ],
      seedData: [
        rec('1', { code: 'APP01', name: 'Clothing ERP Web', version: '1.0.0' }, 'Authorized', 'N'),
      ],
    },

    1108: {
      formId: 1108,
      title: 'SSO Admin',
      breadcrumb: 'Setup Management / SSO Admin',
      columns: [
        { key: 'code', label: 'User Code' },
        { key: 'name', label: 'User Name' },
        { key: 'role', label: 'Role' },
      ],
      seedData: [
        rec('1', { code: 'USR01', name: 'admin', role: 'Super Admin' }, 'Authorized', 'N'),
      ],
    },

    1109: {
      formId: 1109,
      title: 'Branch Collection',
      breadcrumb: 'Setup Management / Branch Collection',
      columns: [
        { key: 'code', label: 'Branch Code' },
        { key: 'name', label: 'Branch Name' },
        { key: 'city', label: 'City' },
      ],
      seedData: [
        rec('1', { code: 'BR01', name: 'Tariq Road Outlet', city: 'Karachi' }, 'Authorized', 'N'),
        rec('2', { code: 'BR02', name: 'Liberty Market Outlet', city: 'Lahore' }, 'UnAuthorize', 'N'),
      ],
    },

    1110: {
      formId: 1110,
      title: 'Transactions Alert',
      breadcrumb: 'Setup Management / Transactions Alert',
      columns: [
        { key: 'code', label: 'Alert Code' },
        { key: 'name', label: 'Alert Name' },
        { key: 'threshold', label: 'Threshold (Rs.)' },
      ],
      seedData: [
        rec('1', { code: 'ALR01', name: 'High Value Sale Alert', threshold: '100000' }, 'Authorized', 'N'),
      ],
    },

    1111: {
      formId: 1111,
      title: 'Resend Request',
      breadcrumb: 'Setup Management / Resend Request',
      columns: [
        { key: 'code', label: 'Request Code' },
        { key: 'name', label: 'Requested For' },
        { key: 'type', label: 'Type' },
      ],
      seedData: [
        rec('1', { code: 'RSQ01', name: 'Invoice #4521', type: 'Email' }, 'UnAuthorize', 'N'),
      ],
    },

    1112: {
      formId: 1112,
      title: 'Resend OTP Request',
      breadcrumb: 'Setup Management / Resend Request',
      columns: [
        { key: 'code', label: 'Request Code' },
        { key: 'name', label: 'Requested For' },
        { key: 'type', label: 'Type' },
      ],
      seedData: [
        rec('1', { code: 'OTP01', name: '0300-1234567', type: 'SMS' }, 'UnAuthorize', 'N'),
      ],
    },

    // ---------- SALES MANAGEMENT ----------
    2001: {
      formId: 2001,
      title: 'Sales Order',
      breadcrumb: 'Sales Management / Sales Order',
      columns: [
        { key: 'code', label: 'Order No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
        { key: 'date', label: 'Order Date' },
      ],
      seedData: [
        rec('1', { code: 'SO-1001', name: 'Ali Garments Outlet', amount: '45,000', date: '12-Sep-2026' }, 'Authorized', 'N'),
        rec('2', { code: 'SO-1002', name: 'Fatima Kids Store', amount: '18,500', date: '15-Sep-2026' }, 'UnAuthorize', 'N'),
      ],
    },
    2002: {
      formId: 2002,
      title: 'Sales Invoice',
      breadcrumb: 'Sales Management / Sales Invoice',
      columns: [
        { key: 'code', label: 'Invoice No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [
        rec('1', { code: 'INV-3001', name: 'Ali Garments Outlet', amount: '45,000' }, 'Authorized', 'N'),
      ],
    },
    2003: {
      formId: 2003,
      title: 'Sales Return',
      breadcrumb: 'Sales Management / Sales Return',
      columns: [
        { key: 'code', label: 'Return No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },
    2004: {
      formId: 2004,
      title: 'Sales Quotation',
      breadcrumb: 'Sales Management / Sales Quotation',
      columns: [
        { key: 'code', label: 'Quotation No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },

    // ---------- PURCHASE MANAGEMENT ----------
    3001: {
      formId: 3001,
      title: 'Purchase Order',
      breadcrumb: 'Purchase Management / Purchase Order',
      columns: [
        { key: 'code', label: 'PO No' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [
        rec('1', { code: 'PO-501', name: 'Al-Karam Textile Mills', amount: '2,10,000' }, 'Authorized', 'N'),
      ],
    },
    3002: {
      formId: 3002,
      title: 'Goods Receipt Note (GRN)',
      breadcrumb: 'Purchase Management / GRN',
      columns: [
        { key: 'code', label: 'GRN No' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },
    3003: {
      formId: 3003,
      title: 'Purchase Return',
      breadcrumb: 'Purchase Management / Purchase Return',
      columns: [
        { key: 'code', label: 'Return No' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },
    3004: {
      formId: 3004,
      title: 'Purchase Requisition',
      breadcrumb: 'Purchase Management / Purchase Requisition',
      columns: [
        { key: 'code', label: 'Requisition No' },
        { key: 'name', label: 'Requested By' },
      ],
      seedData: [],
    },

    // ---------- INVENTORY MANAGEMENT ----------
    4001: {
      formId: 4001,
      title: 'Stock Overview',
      breadcrumb: 'Inventory Management / Stock Overview',
      columns: [
        { key: 'code', label: 'Product Code' },
        { key: 'name', label: 'Product Name' },
        { key: 'qty', label: 'Qty in Stock' },
        { key: 'warehouse', label: 'Warehouse' },
      ],
      seedData: [
        rec('1', { code: 'PRD001', name: 'Kids Winter Jacket', qty: '240', warehouse: 'Main Warehouse' }, 'Authorized', 'N'),
        rec('2', { code: 'PRD003', name: "Women's Lawn Suit", qty: '85', warehouse: 'Main Warehouse' }, 'Authorized', 'N'),
      ],
    },
    4002: {
      formId: 4002,
      title: 'Stock Transfer',
      breadcrumb: 'Inventory Management / Stock Transfer',
      columns: [
        { key: 'code', label: 'Transfer No' },
        { key: 'name', label: 'From -> To' },
        { key: 'qty', label: 'Qty' },
      ],
      seedData: [],
    },
    4003: {
      formId: 4003,
      title: 'Stock Adjustment',
      breadcrumb: 'Inventory Management / Stock Adjustment',
      columns: [
        { key: 'code', label: 'Adjustment No' },
        { key: 'name', label: 'Reason' },
        { key: 'qty', label: 'Qty' },
      ],
      seedData: [],
    },
    4004: {
      formId: 4004,
      title: 'Warehouse Setup',
      breadcrumb: 'Inventory Management / Warehouse Setup',
      columns: [
        { key: 'code', label: 'Warehouse Code' },
        { key: 'name', label: 'Warehouse Name' },
        { key: 'city', label: 'City' },
      ],
      seedData: [
        rec('1', { code: 'WH01', name: 'Main Warehouse', city: 'Karachi' }, 'Authorized', 'N'),
      ],
    },

    // ---------- PAYMENT / PAYABLE ----------
    5001: {
      formId: 5001,
      title: 'Payment Voucher',
      breadcrumb: 'Payment/Payable / Payment Voucher',
      columns: [
        { key: 'code', label: 'Voucher No' },
        { key: 'name', label: 'Paid To' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },
    5002: {
      formId: 5002,
      title: 'Supplier Ledger',
      breadcrumb: 'Payment/Payable / Supplier Ledger',
      columns: [
        { key: 'code', label: 'Supplier Code' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'amount', label: 'Balance (Rs.)' },
      ],
      seedData: [
        rec('1', { code: 'SUP01', name: 'Al-Karam Textile Mills', amount: '2,10,000' }, 'Authorized', 'N'),
      ],
    },
    5003: {
      formId: 5003,
      title: 'Outstanding Payables',
      breadcrumb: 'Payment/Payable / Outstanding Payables',
      columns: [
        { key: 'code', label: 'Supplier Code' },
        { key: 'name', label: 'Supplier Name' },
        { key: 'amount', label: 'Overdue (Rs.)' },
      ],
      seedData: [],
    },

    // ---------- RECEIPT / RECEIVABLE ----------
    6001: {
      formId: 6001,
      title: 'Receipt Voucher',
      breadcrumb: 'Receipt-Receivable / Receipt Voucher',
      columns: [
        { key: 'code', label: 'Voucher No' },
        { key: 'name', label: 'Received From' },
        { key: 'amount', label: 'Amount (Rs.)' },
      ],
      seedData: [],
    },
    6002: {
      formId: 6002,
      title: 'Customer Ledger',
      breadcrumb: 'Receipt-Receivable / Customer Ledger',
      columns: [
        { key: 'code', label: 'Customer Code' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Balance (Rs.)' },
      ],
      seedData: [
        rec('1', { code: 'CUS01', name: 'Ali Garments Outlet', amount: '45,000' }, 'Authorized', 'N'),
      ],
    },
    6003: {
      formId: 6003,
      title: 'Outstanding Receivables',
      breadcrumb: 'Receipt-Receivable / Outstanding Receivables',
      columns: [
        { key: 'code', label: 'Customer Code' },
        { key: 'name', label: 'Customer Name' },
        { key: 'amount', label: 'Overdue (Rs.)' },
      ],
      seedData: [],
    },

    // ---------- CARTS / WISH ----------
    7001: {
      formId: 7001,
      title: 'Shopping Cart',
      breadcrumb: 'Carts/Wish / Shopping Cart',
      columns: [
        { key: 'code', label: 'Cart No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'qty', label: 'Items' },
      ],
      seedData: [],
    },
    7002: {
      formId: 7002,
      title: 'Wishlist',
      breadcrumb: 'Carts/Wish / Wishlist',
      columns: [
        { key: 'code', label: 'Wishlist No' },
        { key: 'name', label: 'Customer Name' },
        { key: 'qty', label: 'Items' },
      ],
      seedData: [],
    },
  };

  getAll(): Record<number, MasterFormConfig> {
    return this.registry;
  }

  getById(formId: number): MasterFormConfig | undefined {
    return this.registry[formId];
  }
}

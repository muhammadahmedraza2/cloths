import { MenuNode } from '../models/menu.model';

export const MENU: MenuNode[] = [
  { label: 'Home', icon: 'bi-house-door', route: '/app/dashboard' },

  {
    label: 'Sales Management',
    icon: 'bi-cart-check',
    children: [
      { label: 'Sales Order', formId: 2001 },
      { label: 'Sales Invoice', formId: 2002 },
      { label: 'Sales Return', formId: 2003 },
      { label: 'Sales Quotation', formId: 2004 },
    ],
  },
  {
    label: 'Purchase Management',
    icon: 'bi-bag-check',
    children: [
      { label: 'Purchase Order', formId: 3001 },
      { label: 'Goods Receipt Note (GRN)', formId: 3002 },
      { label: 'Purchase Return', formId: 3003 },
      { label: 'Purchase Requisition', formId: 3004 },
    ],
  },
  {
    label: 'Setup Management',
    icon: 'bi-gear',
    children: [
      { label: 'Resend Request', formId: 1111 },
      { label: 'Resend OTP Request', formId: 1112 },
      { label: 'Transactions Alert', formId: 1110 },
      { label: 'SSO Admin', formId: 1108 },
      { label: 'Branch Collection', formId: 1109 },
      { label: 'Application Setup', formId: 1107 },
      { label: 'Courier/Security Setup', formId: 1106 },
      { label: 'Bank Setup', formId: 1103 },
      { label: 'Company Setup', formId: 1101 },
      { label: 'Product Setup', formId: 1102 },
      { label: 'Stationery Setup', formId: 1047 },
      { label: 'Geographical Setup', formId: 1104 },
      { label: 'Signatory Management', formId: 1105 },
    ],
  },
  {
    label: 'Inventory Management',
    icon: 'bi-box-seam',
    children: [
      { label: 'Stock Overview', formId: 4001 },
      { label: 'Stock Transfer', formId: 4002 },
      { label: 'Stock Adjustment', formId: 4003 },
      { label: 'Warehouse Setup', formId: 4004 },
    ],
  },
  {
    label: 'Payment/Payable',
    icon: 'bi-wallet2',
    children: [
      { label: 'Payment Voucher', formId: 5001 },
      { label: 'Supplier Ledger', formId: 5002 },
      { label: 'Outstanding Payables', formId: 5003 },
    ],
  },
  {
    label: 'Receipt-Receivable',
    icon: 'bi-receipt',
    children: [
      { label: 'Receipt Voucher', formId: 6001 },
      { label: 'Customer Ledger', formId: 6002 },
      { label: 'Outstanding Receivables', formId: 6003 },
    ],
  },
  {
    label: 'Carts/Wish',
    icon: 'bi-heart',
    children: [
      { label: 'Shopping Cart', formId: 7001 },
      { label: 'Wishlist', formId: 7002 },
    ],
  },

  { label: 'Help', icon: 'bi-question-circle', route: '/app/help' },
  { label: 'Privacy and Policies', icon: 'bi-shield-check', route: '/app/privacy' },
];

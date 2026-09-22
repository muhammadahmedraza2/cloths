export interface CartItemApi {
  id: string;
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  qty: number;
}

export interface CartSummaryApi {
  items: CartItemApi[];
  totalQty: number;
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  name: string;
  imageUrl?: string;
  price: number;
  qty?: number;
}

export enum PaymentMethod {
  Cash = 0,
  BankTransfer = 1,
  EasyPaisa = 2,
  JazzCash = 3,
}

export interface CheckoutRequest {
  paymentMethod: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  transactionReference?: string;
  amountPaid?: number;
}

export interface CheckoutResponse {
  orderNo: string;
  totalAmount: number;
  paymentMethod: string;
  bankName?: string;
  transactionReference?: string;
  amountPaid?: number;
  paymentStatus: string;
  createdAt: string;
}
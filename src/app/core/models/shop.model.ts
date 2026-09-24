export interface ApiResponse<T> { success: boolean; message: string; data: T; errors?: string[]; }

export interface ProductVariant {
  id: string; sizeId: string; sizeName: string; colorId: string; colorName: string;
  sku: string; purchasePrice: number; salePrice: number; stockQuantity: number;
  minimumStockLevel: number; isActive: boolean;
}
export interface Product {
  id: string; productName: string; sku: string; description?: string; categoryId: string;
  categoryName?: string; brandId?: string; brandName?: string; gender: number;
  ageGroupId?: string; ageGroupName?: string; fabric?: string; season?: string;
  purchasePrice: number; salePrice: number; discount: number; stockQuantity: number;
  minimumStockLevel: number; isActive: boolean; images: string[]; variants: ProductVariant[];
}
export interface Category { id: string; name: string; description?: string; imageUrl?: string; isActive: boolean; }
export interface Brand { id: string; name: string; isActive: boolean; }
export interface Size { id: string; name: string; ageRange?: string; isActive: boolean; }
export interface Color { id: string; name: string; hexCode?: string; isActive: boolean; }
export interface AgeGroup { id: string; name: string; minAgeMonths?: number; maxAgeMonths?: number; isActive: boolean; }

export interface AddToCartRequest { productVariantId: string; quantity: number; }
export interface CartItem {
  id: string; productVariantId: string; productName: string; sku: string; imageUrl?: string;
  size: string; color: string; unitPrice: number; quantity: number; total: number;
}
export interface CartResponse {
  cartId: string; items: CartItem[]; totalQuantity: number; totalAmount: number;
}

export enum PaymentMethod { CashOnDelivery = 0, Card = 1, OnlineBankTransfer = 2 }
export enum PaymentStatus { Pending = 0, Paid = 1, Failed = 2, Cancelled = 3, Refunded = 4 }
export enum OrderStatus { Pending = 0, Confirmed = 1, Processing = 2, Packed = 3, Shipped = 4, Delivered = 5, Cancelled = 6, Returned = 7 }

export interface Address {
  id: string; userId: string; addressLine: string; city: string; area?: string;
  postalCode?: string; country: string; isDefault: boolean;
}
export interface CreateOrderRequest {
  shippingAddressId: string; paymentMethod: PaymentMethod; shippingAmount: number;
  bankName?: string; transactionReference?: string; paymentProofId?: string;
}
export interface OrderItem {
  productVariantId: string; productName: string; sku: string; quantity: number;
  unitPrice: number; totalPrice: number;
}
export interface Order {
  id: string; orderNumber: string; invoiceNumber?: string; userId: string; customerName?: string;
  totalAmount: number; discountAmount: number; shippingAmount: number; finalAmount: number;
  paymentMethod: PaymentMethod; paymentStatus: PaymentStatus; orderStatus: OrderStatus;
  createdAt: string; items: OrderItem[];
}
export interface Payment {
  id: string; orderId: string; orderNumber: string; paymentMethod: PaymentMethod;
  amount: number; paymentStatus: PaymentStatus; transactionReference?: string;
  provider?: string; bankName?: string; paymentProofUrl?: string; paymentProofId?: string; paidAt?: string;
}
export interface Dashboard {
  totalUsers: number; totalProducts: number; totalOrders: number; pendingOrders: number;
  todaysSales: number; monthlySales: number; totalRevenue: number; totalPurchases: number;
  lowStockProducts: number; pendingPayments: number;
}
export interface UserSummary {
  id: string; username: string; email?: string; phoneNumber?: string; fullName: string;
  role: string; isActive: boolean;
}
export interface Supplier {
  id: string; name: string; phone?: string; email?: string; address?: string; isActive: boolean;
}
export interface Invoice {
  id: string; invoiceNumber: string; invoiceDate: string; orderId: string; orderNumber: string;
  customer?: string; finalAmount: number; paymentMethod: string; paymentStatus: string;
  items: { productName: string; sku: string; quantity: number; unitPrice: number; totalPrice: number }[];
}
export interface PaymentProof { id: string; originalFileName: string; contentType: string; size: number; }

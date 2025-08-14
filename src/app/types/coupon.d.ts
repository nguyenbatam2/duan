export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  variant_id?: number; // <- optional
}
// types/coupon.ts
export interface Coupon  {
  expiry: ReactNode;
  id: number;
  code: string;
  description?: string | null;
  type: 'percent' | 'fixed' | string; // BE trả 'percent' -> %; có thể thêm 'fixed'
  scope: 'order' | 'product' | 'shipping' | string;
  product_discount: number;
  shipping_discount: number;
  total_discount: number;
  free_shipping: boolean;
};

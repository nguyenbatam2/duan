import { Product } from "../types/product";
const cartKey = "cart";

export function updateCart(cart: Product[]) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated")); // Dispatch a custom event to notify other parts of the app
}

export function getCart(): Product[] {
  // if (typeof window === "undefined" || !window.localStorage) {
  //   return [];
  // }
  const cart = localStorage.getItem(cartKey);
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart(cart);
}

export function getCartLength(): number {
  return getCart().length;
}

export function increaseQuantity(productId: number): void {
  const cart = getCart();
  const updatedCart = cart.map((item) =>
    item.id === Number(productId)
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );
  updateCart(updatedCart);
}

export function decreaseQuantity(productId: number): void {
  const cart = getCart();
  const updatedCart = cart
    .map((item) =>
      item.id === Number(productId) && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  updateCart(updatedCart);
}

export function getCartTotal(): number {
  return getCart().reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
}

export function removeFromCart(productId: number): void {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== Number(productId));
  updateCart(updatedCart);
}
  

export function clearCart() {
  localStorage.removeItem(cartKey);
}

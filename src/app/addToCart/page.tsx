"use client";
import {Product} from "../types/product";
import {addToCart} from "../lib/addCart";

interface AddToCartProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  
}

export default function AddToCart({ product, onAddToCart }: AddToCartProps) {
  const handleAddToCart = () => {
    addToCart(product);
    onAddToCart(product);
  };

  return (
    <button type="button" className="btn-cart btn-views add_to_cart btn btn-primary" onClick={handleAddToCart} >
      <span className="txt-main">Thêm vào giỏ</span>
    </button>
  );
};


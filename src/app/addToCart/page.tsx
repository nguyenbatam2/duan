"use client";
import {Product} from "../types/product";
import {addToCart} from "../lib/addCart";

interface AddToCartProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const AddToCart = ({ product, onAddToCart }: AddToCartProps) => {
  // Kiểm tra nếu không có product thì không render
  if (!product) {
    return null;
  }

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

export default AddToCart;


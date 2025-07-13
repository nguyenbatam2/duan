"use client";

import { useState } from "react";
import { Product } from "@/app/types/product";
import { addToWishlist } from "../lib/wishlist";

interface AddToWishlistProps {
    product: Product;
    onToggle: (action: "add" | "remove") => void;
}

export default function AddToWishlist({ product, onToggle }: AddToWishlistProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleWishlist = () => {
        const next = !isFavorite;
        addToWishlist(product);
        setIsFavorite(next);
        onToggle(next ? "add" : "remove");
    };

    return (
        <a
            className="setWishlist btn-views btn-circle"
            data-wish={product.slug}
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            onClick={handleToggleWishlist}
        >
            <img width="25" height="25" src="/img/heart.webp" alt="Thêm vào yêu thích" />
        </a>
    );
}
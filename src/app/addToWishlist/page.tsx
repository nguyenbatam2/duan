"use client";

import { useState } from "react";
import { Product } from "@/app/types/product";
import { addToWishlist } from "../lib/wishlist";

interface AddToWishlistProps {
    product: Product;
    onToggle: (action: "add" | "remove") => void;
}

const AddToWishlist = ({ product, onToggle }: AddToWishlistProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Kiểm tra nếu không có product thì không render
    if (!product) {
        return null;
    }

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
            <img
                width="25"
                height="25"
                src={isFavorite ? "https://bizweb.dktcdn.net/100/506/650/files/heartadd-1.png?v=1704084436307" : "/img/heart.webp"}
                alt={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            />
        </a>
    );
<<<<<<< HEAD
}


=======
};

export default AddToWishlist;
>>>>>>> 8114f4cab21992087cdd79a04a056c920e3a25ca

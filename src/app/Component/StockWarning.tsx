'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface StockWarningProps {
  productId: number;
  requestedQuantity: number;
  currentStock?: number;
}

export default function StockWarning({ productId, requestedQuantity, currentStock }: StockWarningProps) {
  const [stock, setStock] = useState<number | null>(currentStock || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentStock) {
      checkStock();
    }
  }, [productId]);

  const checkStock = async () => {
    try {
      setLoading(true);
      // Gọi API để kiểm tra tồn kho
      const response = await fetch(`/api/products/${productId}/stock`);
      const data = await response.json();
      setStock(data.stock);
    } catch (error) {
      console.error('Lỗi kiểm tra tồn kho:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-yellow-600">Đang kiểm tra tồn kho...</div>;
  }

  if (stock !== null && requestedQuantity > stock) {
    return (
      <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
        ⚠️ Chỉ còn {stock} sản phẩm trong kho. Vui lòng giảm số lượng!
      </div>
    );
  }

  if (stock !== null && stock <= 5 && stock > 0) {
    return (
      <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
        ⚡ Chỉ còn {stock} sản phẩm trong kho!
      </div>
    );
  }

  return null;
}

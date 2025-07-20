<div className="order-items">
    {order.items.map(item => (
        <div className="order-item" key={item.id}>
            <div className="item-left">
                <img
                    src={item.product_image?.startsWith('http') ? item.product_image : `/${item.product_image}`}
                    alt={item.product_name}
                    className="item-image"
                    width="48"
                    height="48"
                />
                <div className="item-details">
                    <strong>{item.product_name}</strong>
                    <div className="item-details_price">
                        Giá: {item.price.toLocaleString('vi-VN')} đ
                        <span style={{ marginLeft: "16px" }}>
                            Số lượng: <span style={{ color: "red" }}>x{item.quantity}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="item-price">
                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
            </div>

            {/* Nút bình luận */}
            {Reviews_STATUSES.includes(order.status) && (
                <button
                    className="btn-reviews"
                    onClick={() => setShowReviewForm(item.product_id)}
                >
                    Bình luận
                </button>
            )}

            {/* Form review */}
            {showReviewForm === item.product_id && (
                <div className="mt-3 p-3 border rounded bg-light shadow-sm">
                    <h4 className="mb-3">Gửi đánh giá cho sản phẩm: {item.product_name}</h4>

                    {/* Chọn sao */}
                    <div className="mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa-star me-1 ${reviewData.rating >= star ? 'fas text-warning' : 'far text-muted'}`}
                                style={{ cursor: "pointer", fontSize: "20px" }}
                                onClick={() =>
                                    setReviewData((prev) => ({ ...prev, rating: star }))
                                }
                            />
                        ))}
                        <span className="ms-2">{reviewData.rating} / 5</span>
                    </div>

                    {/* Comment */}
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            placeholder="Viết đánh giá của bạn..."
                            rows={3}
                            value={reviewData.comment}
                            onChange={(e) =>
                                setReviewData((prev) => ({ ...prev, comment: e.target.value }))
                            }
                        />
                    </div>

                    {/* Ảnh minh họa */}
                    <div className="mb-3">
                        <label className="form-label">Ảnh minh họa (tối đa 3 ảnh)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setReviewData((prev) => ({
                                    ...prev,
                                    images: Array.from(e.target.files || []).slice(0, 3),
                                }))
                            }
                        />
                        <div className="mt-2 d-flex gap-2 flex-wrap">
                            {reviewData.images?.map((file, idx) => (
                                <img
                                    key={idx}
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "cover", borderRadius: "8px" }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSubmitReview(item.product_id)}
                        >
                            Gửi đánh giá
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowReviewForm(null)}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    ))}
</div>
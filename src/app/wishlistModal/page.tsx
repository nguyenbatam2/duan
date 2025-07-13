"use client";

import { useEffect, useState } from "react";

interface Props {
    action: "add" | "remove";
}

export default function WishlistModal({ action }: Props) {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setActive(false), 3000);
        return () => clearTimeout(timeout);
    }, [action]);

    return (
        <>
            <div
                id="js-global-alert"
                className={`alert alert-success ${action === "add" && active ? "active" : ""}`}
                role="alert"
                style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, minWidth: "300px" }}
            >
                <button type="button" className="close" aria-label="Close" onClick={() => setActive(false)}>
                    <span aria-hidden="true">×</span>
                </button>
                <h5 className="alert-heading">Thêm vào danh sách yêu thích</h5>
                <p className="alert-content">Sản phẩm của bạn đã thêm vào danh sách yêu thích thành công.</p>
            </div>

            <div
                id="js-global-alert"
                className={`alert alert-primary ${action === "remove" && active ? "active" : ""}`}
                role="alert"
                style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, minWidth: "300px" }}
            >
                <button type="button" className="close" aria-label="Close" onClick={() => setActive(false)}>
                    <span aria-hidden="true">×</span>
                </button>
                <h5 className="alert-heading">Xóa khỏi danh sách yêu thích</h5>
                <p className="alert-content">Sản phẩm của bạn đã xóa khỏi sách yêu thích thành công.</p>
            </div>
        </>
    );
}
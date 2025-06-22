// app/logout/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/author";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutUser();
                router.push("/login");
            } catch (error) {
                console.error("Logout thất bại:", error);
                alert("Đăng xuất thất bại!");
                router.push("/login"); // vẫn chuyển hướng để tránh kẹt trang
            }
        };

        handleLogout();
    }, []);

    return <p>Đang đăng xuất...</p>;
}

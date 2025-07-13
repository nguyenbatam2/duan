"use client";
import { useEffect, useContext } from "react";
import { AuthContext } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const { logout } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        logout();                
        router.push("/login");   
    }, []);

    return <p>Đang đăng xuất...</p>;
}

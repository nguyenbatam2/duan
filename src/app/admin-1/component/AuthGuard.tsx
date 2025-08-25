"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>Đang kiểm tra đăng nhập...</span>
      </div>
    );
  }

  return <>{children}</>;
}

// File này đã được tạo trong quá trình sửa đổi
// Nội dung ban đầu không có file này 
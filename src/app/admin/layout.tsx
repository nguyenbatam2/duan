'use client';
import "../admin/style/admin.css";

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import React from 'react';
// import { Toaster, toast } from 'react-hot-toast';
import Navbar from '../admin/component/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

useEffect(() => {
    const token = Cookies.get('token');
    console.log(token);
if(!token){
    router.push('/admin/login');
}
},[router]);
// 
    return (
        <>
            <Navbar />
            { children }
        </>
    );
}

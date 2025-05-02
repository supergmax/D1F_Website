"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SidebarProvider } from "../context/SidebarContext";
import AppSidebar from "../layout/AppSidebar";
import AppHeader from "../layout/AppHeader";
import { CartProvider } from "../context/CartContext";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuth(true);
    }
  }, []);

  if (!isAuth) return null;

  return (
    <SidebarProvider>
    <CartProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <main className="p-8 bg-white flex-1">{children}</main>
        </div>
      </div>
    </CartProvider>
  </SidebarProvider>
  );
};

export default AuthenticatedLayout;

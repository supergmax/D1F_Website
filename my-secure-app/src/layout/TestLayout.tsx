"use client";
import React from "react";
import { SidebarProvider } from "../context/SidebarContext";
import AppSidebar from "../layout/AppSidebar";
import AppHeader from "../layout/AppHeader";

const TestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader /> {/* C’est ici que le header avec le bouton doit être affiché */}
          <main className="p-8 bg-white flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TestLayout;

"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { GridIcon, ListIcon, UserCircleIcon } from "@/icons";

const adminNav = [
  { name: "Admin Dashboard", icon: <GridIcon />, path: "/admin" },
  { name: "User Dashboard", icon: <GridIcon />, path: "/" },
  { name: "Gestion Invoices", icon: <ListIcon />, path: "/admin/invoices" },
  { name: "Gestion Payouts", icon: <ListIcon />, path: "/admin/payouts" },
  { name: "Gestion Purchases", icon: <ListIcon />, path: "/admin/purchases" },
  { name: "Gestion Challenges", icon: <ListIcon />, path: "/admin/challenges" },
  { name: "Mon Profil", icon: <UserCircleIcon />, path: "/user_profile" },
];

export default function Sidebar() {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed mt-16 flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/admin">
          <span className="text-xl font-bold text-gray-700 dark:text-white">D1F Admin</span>
        </Link>
      </div>

      <nav className="mb-6">
        <ul className="flex flex-col gap-4">
          {adminNav.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 rounded-lg p-2 transition ${
                  isActive(item.path)
                    ? "bg-brand-100 text-brand-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.icon}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

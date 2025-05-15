"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  CheckCircleIcon,
  GridIcon,
  ListIcon,
  LockIcon,

  PaperPlaneIcon,
  PlusIcon,
  ShootingStarIcon,
  
  UserCircleIcon,
  //CalenderIcon,
  //UserCircleIcon,
  //TaskIcon,
  //ListIcon,
  //TableIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard®", icon: <GridIcon />, path: "/user_dashboard" },
  { name: "Mon compte", icon: <UserCircleIcon />, path: "/user_profile" },
  { name: "Mes Challenges", icon: <ShootingStarIcon />, path: "/user_challenge" },
  { name: "Affiliation", icon: <PlusIcon />, path: "/user_affiliation" },
  { name: "Shop", icon: <PlusIcon />, path: "/user_shop" },
  { name: "Historique des paiements", icon: <ListIcon />, path: "/user_history" },
  { name: "Formulaire de retrait", icon: <ListIcon />, path: "/user_payout" },
  { name: "Support", icon: <PaperPlaneIcon />, path: "/support" },
  { name: "legal", icon: <CheckCircleIcon />, path: "/user_legal" }
];

{/*{ name: "sucess", icon: <LockIcon />, path: "/success" },
  { name: "SignIn", icon: <LockIcon />, path: "/signin" },
  { name: "SignUp", icon: <LockIcon />, path: "/signup" },*/}


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => path === pathname;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
      ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}>
            {isExpanded || isHovered || isMobileOpen ? "Menu" : ""}
          </h2>
          <ul className="flex flex-col gap-4">
            {navItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

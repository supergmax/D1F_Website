"use client";

import Image from "next/image";
import Link from "next/link";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import SupportModal from "@/components/example/ModalExample/SupportModal";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [affiliateId, setAffiliateId] = useState<string>("—");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    token_balance: number;
    dollar_balance: number;
  } | null>(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur de copie :", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, token_balance, dollar_balance, affiliate_id, role")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setUserData({
          first_name: data.first_name,
          last_name: data.last_name,
          token_balance: data.token_balance,
          dollar_balance: data.dollar_balance,
          email: user.email ?? "—",
        });
        setAffiliateId(data.affiliate_id ?? "—");
        setIsAdmin(data.role === "admin");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center dropdown-toggle text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/user/vert-gold.png"
            alt="User"
          />
        </span>

        <div className="flex items-center space-x-2">
          {userData ? (
            <>
              <span className="text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-md">
                <strong>{userData.token_balance}</strong> WT <br />
                <strong>{userData.dollar_balance}</strong> $
              </span>
            </>
          ) : (
            <span>Chargement...</span>
          )}

          {userData ? (
            <>
              <span className="font-medium text-theme-sm text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                {userData.first_name} {userData.last_name}
              </span>
            </>
          ) : (
            <span>Chargement...</span>
          )}
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="mb-2">
          {userData ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                  {userData.first_name} {userData.last_name}
                </span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-md">
                  <strong>{userData.token_balance}</strong> WT <br />
                  <strong>{userData.dollar_balance}</strong> $
                </span>
              </div>

              <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                {userData.email}
              </span>

              <div className="mt-1 flex items-center justify-between text-theme-xs text-gray-500 dark:text-gray-400">
                <span>ID : <span className="font-mono">{affiliateId}</span></span>
                <button
                  onClick={() => handleCopy(affiliateId)}
                  className="ml-2 text-xs text-blue-500 hover:underline"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </>
          ) : (
            <span>Chargement...</span>
          )}
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Account settings
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              tag="a"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <SupportModal />
            </DropdownItem>
          </li>
        </ul>

        <Link
          href="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Sign out
        </Link>
        {isAdmin && (
          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 font-medium text-blue-600 rounded-lg group text-theme-sm hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-800/10 dark:hover:text-blue-300"
          >
            Admin Panel
          </DropdownItem>
        )}
      </Dropdown>
    </div>
  );
}

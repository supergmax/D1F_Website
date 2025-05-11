"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoltIcon, PlusIcon } from "@/icons";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";


export const EcommerceMetrics = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const handleValidate = () => {
    console.log("Payout requested");
    closeModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Bloc 1 - Current Balance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <PlusIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                CURRENT BALANCE
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                3,782$
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              11.01%
            </Badge>
          </div>
        </div>

        {/* Bloc 2 - Total Payout */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoltIcon className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                TOTAL PAYOUT
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                3400$
              </h4>
            </div>
          </div>
        </div>

        {/* Bloc 3 - Ask Payout */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex items-center justify-center dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <Button size="md" variant="primary" className="w-full max-w-xs" onClick={openModal}>
            Ask Payout
          </Button>
        </div>
      </div>

      {/* Modal intégré ici */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <form>
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Payout Request
          </h4>

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            Account Balance: <strong>$3,400</strong>
          </p>

          <div className="mb-4">
            <Label>Amount to withdraw</Label>
            <Input type="number" placeholder="Enter amount..." />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Link href="/success">
              <Button size="sm" onClick={handleValidate}>
                Validate
              </Button>
            </Link>
            
      </div>
        </form>
      </Modal>
    </>
  );
};

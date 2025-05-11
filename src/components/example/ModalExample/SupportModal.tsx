"use client";
import React from "react";
//import ComponentCard from "../../common/ComponentCard";

import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";

export default function DefaultModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div>
      
        <div onClick={openModal}>
          Support
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Contact Support
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            To contact the support please send us an email at :
          </p>
          <p className="mt-5 text-sm leading-6 text-blue-500 dark:text-blue-500">
            Support@withusfunded.com or Contact@withusfunded.com
          </p>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Link href="mailto:Support@withusfunded.com">
              <Button size="sm">
                Contact
              </Button>
            </Link>
          </div>
        </Modal>

    </div>
  );
}

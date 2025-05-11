"use client";
import React from "react";
import Link from "next/link";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";

export default function PayoutRequestModal() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleValidate = () => {
    // Tu peux remplacer ce log par l'envoi vers ton backend
    console.log("Payout requested");
    closeModal();
  };

  return (
    <div>
      <Button className="dark:bg-white/10 bg-gray-800 flex w-full" size="md" onClick={openModal}>
        Buy amount of token
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-md p-6 lg:p-10"
      >
        <form>
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Buy token
          </h4>

          <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            Current Account Balance: <strong>$3,400</strong>
          </p>

          <div className="mb-4">
            <Label>Amount to buy</Label>
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
    </div>
  );
}

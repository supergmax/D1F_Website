"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
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
    <ComponentCard title="Payout">
      <Button size="sm" onClick={openModal}>
        Request Payout
      </Button>

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
            <Button size="sm" onClick={handleValidate}>
              Validate
            </Button>
          </div>
        </form>
      </Modal>
    </ComponentCard>
  );
}

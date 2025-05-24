"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  dollarBalance: number;
  setResult: (res: { success: string; error: string }) => void;
}

export default function PayoutModal({
  isOpen,
  onClose,
  userId,
  dollarBalance,
  setResult,
}: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    const parsedAmount = Number(amount);

    if (!userId || isNaN(parsedAmount) || parsedAmount < 50) {
      setResult({ success: "", error: "Montant invalide (minimum 50$)" });
      onClose();
      return;
    }

    if (parsedAmount > dollarBalance) {
      setResult({ success: "", error: "Solde insuffisant." });
      onClose();
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("payouts").insert({
      profile_id: userId,
      amount: parsedAmount,
      status: "requested",
    });

    if (error) {
      setResult({ success: "", error: error.message });
    } else {
      setResult({ success: "Demande de retrait enregistrée !", error: "" });
      setAmount("");
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-5">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Demander un retrait
      </h4>

      <div className="mb-6">
        <Label>Montant ($)</Label>
        <Input
          type="number"
          min={50}
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="Entrez un montant (min. 50$)"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onClose}
          className="!bg-red-600 !text-white hover:!bg-red-700 font-semibold px-4 py-2"
        >
          Annuler
        </Button>
        <Button
          onClick={handleValidate}
          disabled={isLoading}
          className="bg-green-600 text-white"
        >
          {isLoading ? "Chargement..." : "Valider"}
        </Button>
      </div>
    </Modal>
  );
}

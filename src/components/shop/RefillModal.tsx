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
  setDollarBalance: (val: number) => void;
  setResult: (res: { success: string; error: string }) => void;
}

export default function RefillModal({
  isOpen,
  onClose,
  userId,
  setDollarBalance,
  setResult,
}: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (!userId || amount === "" || amount < 50) {
      setResult({ success: "", error: "Montant invalide (minimum 50$)" });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ dollar_balance: amount })
      .eq("id", userId);

    if (error) {
      setResult({ success: "", error: error.message });
    } else {
      setDollarBalance(amount); // on met à jour avec la nouvelle valeur
      setResult({ success: "Compte rechargé avec succès !", error: "" });
      setAmount("");
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-5">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Recharger mon compte
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
        <Button variant="outline" onClick={onClose} className="bg-red-600 text-white">
          Cancel
        </Button>
        <Button
          onClick={handleValidate}
          disabled={isLoading}
          className="bg-green-600 text-white"
        >
          {isLoading ? "Chargement..." : "Validate"}
        </Button>
      </div>
    </Modal>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  tokenBalance: number;
  dollarBalance: number;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ChallengeModal({
  isOpen,
  onClose,
  userId,
  tokenBalance,
  dollarBalance,
  onSuccess,
  onError,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const unitPrice = 3000;
  const subTotal = unitPrice * quantity;
  const totalBalance = (tokenBalance ?? 0) + (dollarBalance ?? 0);

  const handleValidate = async () => {
    if (!userId || quantity < 1 || subTotal > totalBalance) {
      onError("Montant invalide ou solde insuffisant pour acheter les challenges.");
      onClose();
      return;
    }

    setIsLoading(true);

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, price")
      .eq("name", "Challenge")
      .eq("available", true)
      .single();

    if (productError || !product) {
      onError("Produit 'Challenge' introuvable ou indisponible.");
      setIsLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("purchases").insert({
      profile_id: userId,
      product_id: product.id,
      quantity,
      amount: subTotal,
    });

    if (insertError) {
      onError("Erreur lors de l'achat : " + insertError.message);
    } else {
      onSuccess("Challenge(s) acheté(s) avec succès !");
      setQuantity(1);
      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-5">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Acheter des Challenges
      </h4>

      <div className="mb-4">
        <Label>Nombre de comptes (minimum 1)</Label>
        <Input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => {
            const val = Math.max(1, Math.floor(Number(e.target.value)));
            setQuantity(val);
          }}
        />
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        Sous-total : <strong>{subTotal} WT</strong>
      </div>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Balance actuelle : <strong>{tokenBalance} WT</strong> + <strong>{dollarBalance} $</strong> = <strong>{totalBalance}</strong>
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
          {isLoading ? "Chargement..." : `Acheter ${quantity} challenge${quantity > 1 ? "s" : ""}`}
        </Button>
      </div>
    </Modal>
  );
}

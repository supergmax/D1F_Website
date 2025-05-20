"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { supabase } from "@/lib/supabaseClient";
import RefillAlert from "./RefillAlert";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  tokenBalance: number;
  dollarBalance: number;
  onSuccess?: (msg: string) => void;
  onError?: (msg: string) => void;
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
  const [message, setMessage] = useState<{ success: string; error: string }>({ success: "", error: "" });

  const unitPrice = 3000;
  const subTotal = unitPrice * quantity;
  const totalBalance = tokenBalance + dollarBalance;

  const handleValidate = async () => {
    setMessage({ success: "", error: "" });

    if (!userId || quantity < 1 || subTotal > totalBalance) {
      const error = "Montant invalide ou solde insuffisant pour acheter les challenges.";
      setMessage({ success: "", error });
      onError?.(error);
      return;
    }

    setIsLoading(true);

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("name", "Challenge")
      .eq("available", true)
      .single();

    if (productError || !product) {
      const error = "Produit 'Challenge' introuvable ou indisponible.";
      setMessage({ success: "", error });
      setIsLoading(false);
      onError?.(error);
      return;
    }

    // Calcul du débit : priorité au token_balance
    const tokenDebit = Math.min(tokenBalance, subTotal);
    const dollarDebit = subTotal - tokenDebit;

    const { error: insertError } = await supabase.from("purchases").insert({
      profile_id: userId,
      product_id: product.id,
      quantity,
      token_debit: tokenDebit,
      dollar_debit: dollarDebit,
      amount: subTotal,
      refunded: false,
      status: "pending", // sera géré par admin ou trigger plus tard
    });

    if (insertError) {
      const error = "Erreur lors de l'achat : " + insertError.message;
      setMessage({ success: "", error });
      onError?.(error);
    } else {
      const success = "Challenge(s) acheté(s) avec succès !";
      setMessage({ success, error: "" });
      onSuccess?.(success);
      setQuantity(1);
      onClose();
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setMessage({ success: "", error: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md p-5">
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
        Balance actuelle : <strong>{tokenBalance} WT</strong> + <strong>{dollarBalance} $</strong> ={" "}
        <strong>{totalBalance}</strong>
      </div>

      {(message.success || message.error) && (
        <RefillAlert
          variant={message.success ? "success" : "error"}
          title={message.success ? "Succès" : "Erreur"}
          message={message.success || message.error}
        />
      )}

      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          onClick={handleClose}
          className="!bg-red-600 !text-white hover:!bg-red-700 font-semibold px-4 py-2"
        >
          Fermer
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

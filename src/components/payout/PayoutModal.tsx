'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import { Modal } from '@/components/ui/modal';

interface PayoutModalProps {
  profileId: string;
  dollarBalance: number;
  onSuccess?: () => void;
}

export default function PayoutModal({ profileId, dollarBalance, onSuccess }: PayoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleRequest = async () => {
    const amountNum = parseInt(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return setError('Montant invalide.');
    }

    if (amountNum > dollarBalance) {
      return setError('Le montant dépasse votre solde disponible.');
    }

    setError('');

    // Créer une ligne payout
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        profile_id: profileId,
        amount: amountNum,
        status: 'pending'
      })
      .select()
      .single();

    if (payoutError) {
      return setError('Erreur lors de la demande de retrait.');
    }

    // Créer une ligne invoice liée
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        profile_id: profileId,
        amount: amountNum,
        status: 'open',
        note: `Demande de retrait liée à payout_id=${payout.id}`
      })
      .select()
      .single();

    if (invoiceError) {
      return setError('Erreur lors de la génération de la facture.');
    }

    // Créer la transaction liée
    await supabase
      .from('transactions')
      .insert({
        profile_id: profileId,
        type: 'payout',
        ref_id: payout.id,
        dollar_debit: amountNum,
        status: 'pending',
        note: `Transaction automatique liée à payout_id=${payout.id} & invoice_id=${invoice.id}`
      });

    setIsOpen(false);
    setAmount('');
    onSuccess?.();
  };

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        Demander un retrait
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-lg">
        <div className="p-6 space-y-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Demande de retrait</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Solde disponible : <strong>{dollarBalance} $</strong>
          </p>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant à retirer"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleRequest}>Confirmer</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

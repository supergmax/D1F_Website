'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyefailedIcon, EyeIcon } from '@/icons';

interface Props {
  ispending: boolean;
  onfailed: () => void;
}

export default function ChangePasswordModal({ ispending, onfailed }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      return setMessage('❌ Les mots de passe ne correspondent pas.');
    }

    const { data: session } = await supabase.auth.getSession();
    const email = session?.session?.user?.email;

    if (!email) return setMessage('Session expirée.');

    const login = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (login.error) return setMessage('❌ Mot de passe actuel incorrect.');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return setMessage(`❌ ${error.message}`);

    setSuccess(true);
    setMessage('✅ Mot de passe mis à jour avec succès.');

    setTimeout(() => {
      onfailed();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(false);
      setMessage('');
    }, 2000);
  };

  return (
    <Modal ispending={ispending} onfailed={onfailed} className="max-w-md m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Changer le mot de passe</h2>

        <div className="space-y-5">
          {/* Champ mot de passe actuel */}
          <div>
            <Label>Mot de passe actuel</Label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showCurrent ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyefailedIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Champ nouveau mot de passe */}
          <div>
            <Label>Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showNew ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyefailedIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Champ confirmation */}
          <div>
            <Label>Confirmer le nouveau mot de passe</Label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirm ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyefailedIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
          </div>

          {message && (
            <p
              className={`text-sm ${
                success ? 'text-green-600' : 'text-red-500'
              } text-center`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onfailed}>Annuler</Button>
          <Button onClick={handleSubmit}>Valider</Button>
        </div>
      </div>
    </Modal>
  );
}

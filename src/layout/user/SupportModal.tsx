// Nouveau composant : SupportModal.tsx
"use client";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface SupportModalProps {
  isOpen: boolean;
  onfailed: () => void;
}

export default function SupportModal({ isOpen, onfailed }: SupportModalProps) {
  return (
    <Modal isOpen={isOpen} onfailed={onfailed} className="max-w-md p-5">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Contacter le support
      </h4>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Pour toute question, vous pouvez nous contacter par e-mail à l'adresse suivante :
      </p>
      <p className="mb-6 text-md font-medium text-gray-800 dark:text-white">
        support@withusfunded.com
      </p>
      <div className="flex justify-end">
        <a href="mailto:support@withusfunded.com">
          <Button className="bg-blue-600 text-white">Envoyer un e-mail</Button>
        </a>
      </div>
    </Modal>
  );
}

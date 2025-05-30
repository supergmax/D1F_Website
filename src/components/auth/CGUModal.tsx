"use client";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface CGUModalProps {
  isRequested: boolean;
  onClose: () => void;
}

export default function CGUModal({ isRequested, onClose }: CGUModalProps) {
  return (
    <Modal
      isOpen={isRequested}
      onClose={onClose}
      isFullscreen={true}
      showCloseButton={true}
    >
      <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
        <div>
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Conditions Générales d’Utilisation
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod est quis mauris lacinia pharetra. Sed a
            ligula ac odio condimentum aliquet a nec nulla. Aliquam bibendum
            ex sit amet ipsum rutrum feugiat ultrices enim quam.
          </p>
          <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod est quis mauris lacinia pharetra. Sed a
            ligula ac odio condimentum aliquet a nec nulla. Aliquam bibendum
            ex sit amet ipsum rutrum feugiat ultrices enim quam odio
            condimentum aliquet a nec nulla pellentesque euismod est quis
            mauris lacinia pharetra.
          </p>
          <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod est quis mauris lacinia pharetra.
          </p>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

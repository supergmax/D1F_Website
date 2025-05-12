"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { supabase } from "@/lib/supabaseClient";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface AddressFields {
  country: string;
  city_state: string;
}

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [fields, setFields] = useState<AddressFields>({
    country: "",
    city_state: "",
  });

  const handleInputChange = (field: keyof AddressFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    async function fetchAddress() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      setProfileId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("country")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setFields({
          country: data.country || "",
          city_state: data.city_state || "",
        });
      }
    }

    fetchAddress();
  }, [supabase]);

  const handleSave = async () => {
    if (!profileId) return;

    const { error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", profileId);

    if (error) {
      console.error("Erreur lors de la sauvegarde :", error.message);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{fields.country}</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">City/State</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{fields.city_state}</p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input
                    type="text"
                    value={fields.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
                <div>
                  <Label>City/State</Label>
                  <Input
                    type="text"
                    value={fields.city_state}
                    onChange={(e) => handleInputChange("city_state", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { supabase } from "@/lib/supabaseClient";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface ProfileInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  facebook_url: string;
  x_url: string;
  linkedin_url: string;
  instagram_url: string;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [fields, setFields] = useState<ProfileInfo>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
    facebook_url: "",
    x_url: "",
    linkedin_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;
      if (!user) return;

      setProfileId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name"
        )
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setFields({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          facebook_url: data.facebook_url || "",
          x_url: data.x_url || "",
          linkedin_url: data.linkedin_url || "",
          instagram_url: data.instagram_url || "",
        });
      }
    }

    fetchProfile();
  }, [supabase]);

  const handleInputChange = (field: keyof ProfileInfo, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profileId) return;

    const { error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", profileId);

    if (error) {
      console.error("Erreur sauvegarde profil :", error.message);
    } else {
      closeModal();
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {fields.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {fields.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {fields.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {fields.phone}
              </p>
            </div>

            <div className="lg:col-span-2">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Bio</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {fields.bio}
              </p>
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

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value={fields.facebook_url}
                      onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>X.com</Label>
                    <Input
                      type="text"
                      value={fields.x_url}
                      onChange={(e) => handleInputChange("x_url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      type="text"
                      value={fields.linkedin_url}
                      onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      value={fields.instagram_url}
                      onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={fields.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={fields.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={fields.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      value={fields.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label>Bio</Label>
                    <Input
                      type="text"
                      value={fields.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </div>
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
    </div>
  );
}

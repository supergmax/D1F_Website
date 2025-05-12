"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { supabase } from "@/lib/supabaseClient";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

interface MetaFields {
  first_name: string;
  last_name: string;
  bio: string;
  city_state: string;
  avatar_url: string;
  facebook_url: string;
  x_url: string;
  linkedin_url: string;
  instagram_url: string;
}

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [fields, setFields] = useState<MetaFields>({
    first_name: "",
    last_name: "",
    bio: "",
    city_state: "",
    avatar_url: "/images/user/owner.jpg",
    facebook_url: "",
    x_url: "",
    linkedin_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    async function fetchMeta() {
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

      if (!error && data) {
        setFields({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          city_state: data.city_state || "",
          avatar_url: data.avatar_url || "/images/user/owner.jpg",
          facebook_url: data.facebook_url || "",
          x_url: data.x_url || "",
          linkedin_url: data.linkedin_url || "",
          instagram_url: data.instagram_url || "",
        });
      }
    }

    fetchMeta();
  }, [supabase]);

  const handleInputChange = (field: keyof MetaFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profileId) return;

    const { error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", profileId);

    if (error) {
      console.error("Erreur sauvegarde meta:", error.message);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={fields.avatar_url}
                alt="avatar"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {fields.first_name} {fields.last_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{fields.bio}</p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{fields.city_state}</p>
              </div>
            </div>

            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {[
                { href: fields.facebook_url, label: "Facebook" },
                { href: fields.x_url, label: "X" },
                { href: fields.linkedin_url, label: "LinkedIn" },
                { href: fields.instagram_url, label: "Instagram" },
              ]
                .filter((link) => !!link.href)
                .map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                  >
                    {link.label[0]}
                  </a>
                ))}
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
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your basic profile information.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
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
                <div className="lg:col-span-2">
                  <Label>City / State</Label>
                  <Input
                    type="text"
                    value={fields.city_state}
                    onChange={(e) => handleInputChange("city_state", e.target.value)}
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
                <div className="lg:col-span-2">
                  <Label>Avatar URL</Label>
                  <Input
                    type="text"
                    value={fields.avatar_url}
                    onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">Social Links</h5>
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
                    <Label>X / Twitter</Label>
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

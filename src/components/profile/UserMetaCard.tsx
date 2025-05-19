"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

interface UserMetaCardProps {
  role: string;
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  facebook_url: string;
  x_url: string;
  linkedin_url: string;
  instagram_url: string;
}

export default function UserMetaCard({
  role,
  id,
  first_name,
  last_name,
  bio,
  facebook_url,
  x_url,
  linkedin_url,
  instagram_url,
}: UserMetaCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [fields, setFields] = useState({
    role,
    first_name,
    last_name,
    bio,
    facebook_url,
    x_url,
    linkedin_url,
    instagram_url,
    country: "",
  });

  useEffect(() => {
    const fetchCountry = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("country")
        .eq("id", id)
        .single();

      if (!error && data?.country) {
        setFields((prev) => ({ ...prev, country: data.country }));
      }
    };

    fetchCountry();
  }, [id]);

  const handleChange = (key: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", id);

    if (!error) setIsOpen(false);
    else console.error("Erreur mise à jour:", error.message);
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="flex justify-between items-start flex-col xl:flex-row xl:items-center">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src="/images/user/vert-gold.png"
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {first_name} {last_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {fields.country || "Non renseigné"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="text-sm border px-3 py-1.5 mt-4 xl:mt-0 rounded-4xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✏️ Modifier
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Modifier le profil</h2>
          <div className="grid gap-4">
            <div>
              <Label>Prénom</Label>
              <Input
                value={fields.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input
                value={fields.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Input
                value={fields.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
              />
            </div>
            <div>
              <Label>Pays</Label>
              <Input
                value={fields.country}
                onChange={(e) => handleChange("country", e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

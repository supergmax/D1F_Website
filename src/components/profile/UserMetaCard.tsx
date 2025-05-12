"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface UserMetaCardProps {
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
    first_name,
    last_name,
    bio,
    facebook_url,
    x_url,
    linkedin_url,
    instagram_url,
  });

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
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {first_name} {last_name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{bio}</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <Label>Facebook</Label>
              <Input
                value={fields.facebook_url}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
              />
            </div>
            <div>
              <Label>X</Label>
              <Input
                value={fields.x_url}
                onChange={(e) => handleChange("x_url", e.target.value)}
              />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={fields.linkedin_url}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={fields.instagram_url}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
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

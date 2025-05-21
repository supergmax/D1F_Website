"use client";

import React from "react";
import Alert from "@/components/ui/alert/Alert";

interface Props {
  variant: "success" | "error";
  title: string;
  message: string;
}

export default function RefillAlert({ variant, title, message }: Props) {
  return (
    <div className="mt-2">
      <Alert
        variant={variant}
        title={title}
        message={message}
      />
    </div>
  );
}

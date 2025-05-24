"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [ispending, setIspending] = useState(initialState);

  const pendingModal = useCallback(() => setIspending(true), []);
  const failedModal = useCallback(() => setIspending(false), []);
  const toggleModal = useCallback(() => setIspending((prev) => !prev), []);

  return { ispending, pendingModal, failedModal, toggleModal };
};

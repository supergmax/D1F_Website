"use client";

import { useEffect, useState } from "react";

/**
 * Hook pour détecter si l'utilisateur est sur un écran mobile.
 * @param maxWidth - largeur max en pixels pour être considéré comme "mobile"
 * @returns boolean indiquant si l'écran est mobile
 */
export function useIsMobile(maxWidth: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= maxWidth);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [maxWidth]);

  return isMobile;
}

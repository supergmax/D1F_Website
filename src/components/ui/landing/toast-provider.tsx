"use client"

import * as React from "react"
import { ToastProvider as RadixToastProvider } from "@/components/ui/landing/toast"
import { useState, createContext, useContext } from "react"
import { ToastProps } from "@radix-ui/react-toast"

export type ToastActionElement = React.ReactNode

export interface ToastData extends ToastProps {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

interface ToastContextType {
  toasts: ToastData[]
  setToasts: React.Dispatch<React.SetStateAction<ToastData[]>>
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      <RadixToastProvider>{children}</RadixToastProvider>
    </ToastContext.Provider>
  )
}

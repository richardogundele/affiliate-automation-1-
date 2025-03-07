"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationsContextType {
  addNotification: (type: NotificationType, message: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  const addNotification = useCallback(
    (type: NotificationType, message: string) => {
      toast({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: message,
        variant: type === "error" ? "destructive" : "default",
      })
    },
    [toast],
  )

  return <NotificationsContext.Provider value={{ addNotification }}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}


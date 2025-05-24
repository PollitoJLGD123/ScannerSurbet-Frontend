"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AlertType = "success" | "error" | "warning" | "info" | "question"

interface ElegantAlertProps {
  isOpen: boolean
  onClose: () => void
  type: AlertType
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  autoClose?: number // milliseconds
  showCloseButton?: boolean
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-500",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    titleColor: "text-green-900 dark:text-green-100",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-500",
    bgGradient: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    titleColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-amber-500",
    bgGradient: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    titleColor: "text-amber-900 dark:text-amber-100",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    bgGradient: "from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
  question: {
    icon: HelpCircle,
    iconColor: "text-purple-500",
    bgGradient: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    titleColor: "text-purple-900 dark:text-purple-100",
  },
}

export function ElegantAlert({
  isOpen,
  onClose,
  type,
  title,
  description,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  autoClose,
  showCloseButton = true,
}: ElegantAlertProps) {
  const [isVisible, setIsVisible] = useState(false)

  const config = alertConfig[type]
  const Icon = config.icon
  const isQuestion = type === "question"

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)

      if (autoClose && autoClose > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, autoClose)

        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [isOpen, autoClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  const handleConfirm = () => {
    onConfirm?.()
    handleClose()
  }

  const handleCancel = () => {
    onCancel?.()
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={showCloseButton ? handleClose : undefined}
      />

      {/* Alert Content */}
      <div
        className={cn(
          "relative w-full max-w-md transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-gradient-to-br shadow-2xl",
            config.bgGradient,
            config.borderColor,
          )}
        >
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />

          {/* Content */}
          <div className="relative p-6">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                <Icon className={cn("h-8 w-8", config.iconColor)} />
              </div>
            </div>

            {/* Title */}
            <h3 className={cn("mb-2 text-center text-xl font-semibold", config.titleColor)}>{title}</h3>

            {/* Description */}
            {description && (
              <p className="mb-6 text-center text-sm text-muted-foreground leading-relaxed">{description}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              {isQuestion ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  >
                    {cancelText}
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1 bg-primary shadow-lg hover:bg-primary/90">
                    {confirmText}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleConfirm || handleClose}
                  className="w-full bg-primary shadow-lg hover:bg-primary/90"
                >
                  {confirmText}
                </Button>
              )}
            </div>

            {/* Auto-close indicator */}
            {autoClose && autoClose > 0 && (
              <div className="mt-4">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-white/40 transition-all ease-linear"
                    style={{
                      animation: `shrink ${autoClose}ms linear`,
                    }}
                  />
                </div>
                <p className="mt-1 text-center text-xs text-muted-foreground">Se cerrará automáticamente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

// Hook para usar el alert de manera más fácil
export function useElegantAlert() {
  const [alert, setAlert] = useState<{
    isOpen: boolean
    type: AlertType
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    autoClose?: number
    showCloseButton?: boolean
  }>({
    isOpen: false,
    type: "info",
    title: "",
  })

  const showAlert = (options: Omit<typeof alert, "isOpen">) => {
    setAlert({ ...options, isOpen: true })
  }

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }))
  }

  const AlertComponent = () => <ElegantAlert {...alert} onClose={hideAlert} />

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  }
}

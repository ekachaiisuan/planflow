'use client'

import { BetterAuthActionButton } from "./better-auth-action"
import { sendVerificationEmailAction } from "@/server/auth-actions"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

export function VerifyEmail({ email }: { email: string }) {
    const [timeLeft, setTimeLeft] = useState(300) //5 minutes
    const interval = useRef<NodeJS.Timeout>(undefined)

    const startTimer = React.useCallback((time = 300) => {
        setTimeout(() => setTimeLeft(time), 0)
        interval.current = setInterval(() => {
            setTimeLeft(t => {
                const newTime = t - 1
                if (newTime <= 0) {
                    clearInterval(interval.current)
                    return 0
                }
                return newTime
            })
        }, 1000)
    }, [])

    useEffect(() => {
        startTimer()
        return () => {
            if (interval.current) clearInterval(interval.current)
        }
    }, [startTimer])

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Verify your email address</h1>
            <p className="text-muted-foreground text-sm text-balance">
                Check your email {email} for a verification link
            </p>
            <BetterAuthActionButton
                value="outline"
                className="w-xs"
                successMessage="Verification email sent!"
                disabled={timeLeft > 0}
                action={() => {
                    startTimer()
                    return sendVerificationEmailAction({
                        email,
                        callbackURL: "/"
                    })
                }}
            >
                {timeLeft > 0 ? `Resend Verification Email (${timeLeft})` : "Resend Verification Email"}
            </BetterAuthActionButton>

        </div>
    )
}
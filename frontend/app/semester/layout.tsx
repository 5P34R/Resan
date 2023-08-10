"use client"
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function SemesterPageLayout({ children }: { children: ReactNode }) {
    const { state } = useAuth()
    const router = useRouter()
    useEffect(() => {
        if (!state.isAuthenticated) {
            router.push("/login")
        }
    }, [state.isAuthenticated, router]) // Add the dependencies for the useEffect

    return (
        <>{children}</> 
    )
}

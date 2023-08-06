"use client"

// import { useAuth } from "@/contexts/authContext"
// import { redirect } from "next/navigation"

export default function StudentLayout({ children }: { children: React.ReactNode    }) {
    
    // const { state } = useAuth()
    // if (!state.isAuthenticated) {
    //     redirect("/login")
    // }
    return <>{children}</>
}
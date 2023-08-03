"use client"
import { useEffect } from 'react'

import { redirect } from 'next/navigation'

export default function IndexPage() {
  // check localStorage for token and redirect to dashboard if token exists
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      redirect("/login")
    }
  }, [])
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed components <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
        
      </div>
    </section>
  )
}

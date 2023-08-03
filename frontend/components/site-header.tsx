import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import UserNav from "./user-nav"
import React from "react"
import SemSwitcher from "./switcher"


export function SiteHeader() {
  const token = localStorage.getItem("access_token"); // Get the token without useState

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            {
              token ? (
                <>
                  <SemSwitcher />
                  <ThemeToggle />
                  <UserNav /> 
                </>
              ) 
            : 
            <ThemeToggle />
            } 
          </nav>
        </div>
      </div>
    </header>
  );
}

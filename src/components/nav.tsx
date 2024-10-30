"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import { HoveredLink, Menu, MenuItem } from "./navbar-menu";
import { cn } from "@/lib/utils";

export function Nav() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { user, isLoading } = useUser();

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Menu">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Home</HoveredLink>
            <HoveredLink href="/external">Text Record Room</HoveredLink>
            <HoveredLink href="/image">Image Record Room</HoveredLink>
            <HoveredLink href="/video">Video record Room</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <HoveredLink href="/">Hobby</HoveredLink>
        </MenuItem>

        {!isLoading && !user && (
          <MenuItem setActive={setActive} active={active} item="Login">
            <Link href="/api/auth/login" className="text-sm">
              Log in
            </Link>
          </MenuItem>
        )}

        {user && (
          <MenuItem setActive={setActive} active={active} item="Profile">
            <div className="flex flex-col items-center text-sm space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={user.picture || "/default-profile.png"}
                  alt="Profile"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                <span>{user.name}</span>
              </div>
              <HoveredLink href="/profile">Profile</HoveredLink>
              <Link href="/api/auth/logout" className="text-red-500">
                Log out
              </Link>
            </div>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

"use client";

import { LogOut, Menu } from "lucide-react";
import { ThemeSelector } from "./ThemeSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";

export default function AccountMenu({ email }: { email: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hover:cursor-pointer">
          <Menu className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-56 w-56">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Logged in as</span>
            <span className="text-xs font-semibold truncate">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex justify-between items-center py-1">
            <DropdownMenuLabel className="text-sm font-medium">
              Theme
            </DropdownMenuLabel>
            <ThemeSelector />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-1 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

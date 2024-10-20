"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex  justify-between items-center bg-neutral-400 h-16">
      <div className="bg-red-500 h-16 w-16 flex justify-center items-center">
        <Link href="/home">TODOS</Link>
      </div>
      <div className="flex gap-5 p-2 font-bold">
        <Link
          href="/"
          className={cn(
            "text-white text-xl bold",
            pathname === "/" && "text-red-500"
          )}
        >
          Home
        </Link>
        <Link
          href="/trash"
          className={cn(
            "text-white text-xl bold",
            pathname === "/trash" && "text-red-500"
          )}
        >
          Trash
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

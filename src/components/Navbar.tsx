"use client";

import * as React from "react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { Button } from "./Button";

export function NavBar({ accountVerified = false }) {
  return (
    <div className="flex flex-row justify-between mb-4">
      <div>
        <h1 className="text-4xl">Sandbox</h1>
      </div>
      <div className="text-base flex flex-row items-start">
        {accountVerified == false ? (
          <div className="text-center p-2 bg-amber-800 text-neutral-100 rounded-md">
            Account is not verified
          </div>
        ) : (
          <></>
        )}
        <div className="ml-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

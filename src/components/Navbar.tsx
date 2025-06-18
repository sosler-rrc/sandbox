"use client";

import * as React from "react";
import LogoutButton from "./LogoutButton";

export function NavBar({ accountVerified = false }) {
  return (
    <div className="flex flex-row justify-between m-4">
      <div>
        <h1 className="text-4xl">Sandbox</h1>
      </div>
      <div className="text-base flex flex-row items-start">
        {accountVerified ?? (
          <>
            <div className="text-center p-2 bg-amber-800 text-neutral-100 rounded-md mr-2">
              Account is not verified
            </div>
          </>
        )}
        <div className="">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

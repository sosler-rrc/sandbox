"use client"

import * as React from "react"
import Link from "next/link"


export function NavBar() {
  return (
    <div className="flex flex-row justify-between mr-[40px]">
      <div >
        <h1 className="">Sandbox</h1>
      </div>
      <div className="">
        <button>Test</button>
      </div>
    </div>
  )
}
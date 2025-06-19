"use client";
import { Button } from "./Button";

export default function FriendsList() {
  return (
    <div className="min-w-3xs min-h-[350px] border rounded">
      <div className="flex justify-between items-center border-b p-2">
        <h1 className="text-center w-full">Friends</h1>
        <Button>Add</Button>
      </div>
    </div>
  );
}

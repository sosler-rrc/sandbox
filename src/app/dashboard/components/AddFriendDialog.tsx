"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { SendFriendRequest } from "../actions";
import { toast } from "sonner";

interface AddFriendDialogProps {
  userId: string;
  drawerState: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddFriendDialog({ userId, drawerState, setIsOpen }: AddFriendDialogProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setError(undefined);
    setUsername("");
  }, [drawerState]);

  async function handleSendFriendRequest() {
    const result = await SendFriendRequest(userId, username);
    if (result?.message && !result.success) {
      setError(result.message);
    } else {
      toast("Friend request successfully sent", {
        position: "top-center",
      });
      setIsOpen(false);
    }
  }

  return (
    <Dialog
      open={drawerState}
      onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col">
              <div className="flex flex-row items-center">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-64 mr-4 h-8"
                  type="text"
                  placeholder="Enter username"
                />
                <Button
                  className="w-16 h-8"
                  onClick={() => handleSendFriendRequest()}>
                  Add
                </Button>
              </div>
              <div className="text-red-500 text-base">{error}</div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

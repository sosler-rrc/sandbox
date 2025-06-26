"use client";
import { Button } from "../../../components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { DeleteUserFriend } from "../actions";

interface DeleteFriendDialogProps {
  friendUserId: string;
  drawerState: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function DeleteFriendDialog({
  friendUserId,
  drawerState,
  setIsOpen,
}: DeleteFriendDialogProps) {
  function closeDialog() {
    setIsOpen(false);
  }

  async function removeFriend() {
    await DeleteUserFriend(friendUserId);
    setIsOpen(false);
  }

  return (
    <Dialog
      open={drawerState}
      onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove friend</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col">
              <span>Are you sure you want to remove this friend?</span>

              <div className="flex flex-row justify-center mt-4">
                <Button
                  className="w-24"
                  variant="red"
                  onClick={() => removeFriend()}>
                  Remove
                </Button>
                <Button
                  className="w-24 ml-2"
                  variant="gray"
                  onClick={() => closeDialog()}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

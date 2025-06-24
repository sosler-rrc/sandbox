"use client";
import { Button } from "../../../components/Button";
import { Bell, UserSearch } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FriendRequest } from "@/models/FriendRequest";

interface FriendRequestProps {
  receivedFriendRequests: FriendRequest[];
  sentFriendRequests: FriendRequest[];
  onAcceptRequest: (requestId: string) => void;
  onCancelRequest: (requestId: string) => void;
}

export default function FriendNotificationPopover({
  receivedFriendRequests,
  sentFriendRequests,
  onAcceptRequest,
  onCancelRequest,
}: FriendRequestProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex flex-row cursor-pointer">
          <UserSearch size={24} />
          {(receivedFriendRequests.length > 0 || sentFriendRequests.length > 0) && (
            <div className="bg-red-500 text-white rounded text-xs h-4 w-4 text-center select-none">
              {receivedFriendRequests.length + sentFriendRequests.length}
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        {receivedFriendRequests.length > 0 && (
          <div>
            <h2 className="text-lg border-b mb-2">Incoming Friend Requests</h2>
            {receivedFriendRequests.map((x) => (
              <div
                key={x.id}
                className="flex flex-row items-center justify-between">
                <div>{x.sender.userName}</div>
                <div>
                  <Button
                    className="h-6 w-16 !p-0 text-sm"
                    onClick={() => onAcceptRequest(x.id)}
                    variant="green">
                    Add
                  </Button>
                  <Button
                    className="h-6 w-16 !p-0 text-sm ml-1"
                    onClick={() => onCancelRequest(x.id)}
                    variant="red">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {sentFriendRequests.length > 0 && (
          <div>
            <h2 className="text-lg border-b mb-2">Sent Friend Requests</h2>
            {sentFriendRequests.map((x) => (
              <div
                key={x.id}
                className="flex flex-row items-center justify-between">
                <div>{x.receiver.userName}</div>
                <div>
                  <Button
                    className="h-6 w-16 !p-0 text-sm ml-1"
                    onClick={() => onCancelRequest(x.id)}
                    variant="red">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {sentFriendRequests.length == 0 && receivedFriendRequests.length == 0 && (
          <div>No pending friend requests</div>
        )}
        <div></div>
      </PopoverContent>
    </Popover>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/Button";
import {
  GetUserFriends,
  GetUserReceivedFriendsRequests,
  AddUserFriend,
  CancelFriendRequest,
  GetUserSentFriendsRequests,
} from "../actions";
import { FriendRequest } from "@/models/FriendRequest";
import { User } from "@/models/User";
import AddFriendDialog from "./AddFriendDialog";
import { MessageCirclePlus, Trash2, UserSearch } from "lucide-react";
import FriendNotificationPopover from "./FriendNotificationPopover";

interface FriendsListProps {
  userId: string;
}

export default function FriendsList({ userId }: FriendsListProps) {
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<FriendRequest[]>([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  async function loadFriends() {
    try {
      const userFriends = await GetUserFriends(userId);
      setFriends(userFriends);
    } catch (err) {
      setError("An error occurred");
    }
  }

  async function loadFriendRequests() {
    try {
      setReceivedFriendRequests(await GetUserReceivedFriendsRequests(userId));
      setSentFriendRequests(await GetUserSentFriendsRequests(userId));
    } catch (err) {
      setError("An error occurred");
    }
    console.log(friends);
  }

  useEffect(() => {
    loadFriendRequests();
    loadFriends();
  }, [userId]);

  async function handleIncomingAcceptRequest(requestId: string) {
    await AddUserFriend(requestId);
    loadFriendRequests();
  }

  async function handleIncomingCancelRequest(requestId: string) {
    await CancelFriendRequest(requestId);
    loadFriendRequests();
  }

  return (
    <div className="min-w-xs min-h-[350px] border rounded border-black">
      <div className="flex justify-between items-center border-b border-black px-4 py-2 mb-4">
        <FriendNotificationPopover
          receivedFriendRequests={receivedFriendRequests}
          sentFriendRequests={sentFriendRequests}
          onAcceptRequest={handleIncomingAcceptRequest}
          onCancelRequest={handleIncomingCancelRequest}
        />
        <h1 className="text-center w-full text-lg">Friends</h1>
        <Button onClick={() => setIsOpen(true)}>Add</Button>
      </div>
      <AddFriendDialog
        userId={userId}
        setIsOpen={setIsOpen}
        drawerState={isOpen}
      />
      {friends.map((x) => (
        <div
          key={x.id}
          className="flex flex-row px-6 justify-between">
          <div>{x.userName}</div>
          <div>
            <button className="text-emerald-600 cursor-pointer px-1">
              <MessageCirclePlus />
            </button>
            <button className="text-red-500 cursor-pointer px-1">
              <Trash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

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
import DeleteFriendDialog from "./DeleteFriendDialog";
import { UserFriend } from "@/models/UserFriend";

interface FriendsListProps {
  userId: string;
}

export default function FriendsList({ userId }: FriendsListProps) {
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<UserFriend[]>([]);
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<FriendRequest[]>([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const [isAddFriendDialogIsOpen, setAddFriendDialogIsOpen] = useState(false);
  const [isDeleteFriendDialogIsOpen, setDeleteFriendDialogIsOpen] = useState(false);

  async function loadFriends() {
    try {
      const userFriends = await GetUserFriends(userId);
      setFriends(userFriends);
    } catch (err) {
      setError("An error occurred while loading friends list");
    }
  }

  async function loadFriendRequests() {
    try {
      setReceivedFriendRequests(await GetUserReceivedFriendsRequests(userId));
      setSentFriendRequests(await GetUserSentFriendsRequests(userId));
    } catch (err) {
      setError("An error occurred while loading friend requests");
    }
  }

  const refreshFriends = () => {
    loadFriendRequests();
    loadFriends();
  };

  useEffect(() => {
    refreshFriends();
  }, [userId, isAddFriendDialogIsOpen, isDeleteFriendDialogIsOpen]);

  async function handleIncomingAcceptRequest(requestId: string) {
    await AddUserFriend(requestId);
    refreshFriends();
  }

  async function handleIncomingCancelRequest(requestId: string) {
    await CancelFriendRequest(requestId);
    refreshFriends();
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
        <Button onClick={() => setAddFriendDialogIsOpen(true)}>Add</Button>
      </div>
      <AddFriendDialog
        userId={userId}
        setIsOpen={setAddFriendDialogIsOpen}
        drawerState={isAddFriendDialogIsOpen}
      />

      {friends.map((x) => (
        <div
          key={x.id}
          className="flex flex-row px-6 justify-between">
          <div>{x.friendUser.userName}</div>
          <div>
            <button className="text-emerald-600 cursor-pointer px-1">
              <MessageCirclePlus />
            </button>
            <button
              className="text-red-500 cursor-pointer px-1"
              onClick={() => setDeleteFriendDialogIsOpen(true)}>
              <Trash2 />
            </button>
            <DeleteFriendDialog
              friendUserId={x.id}
              setIsOpen={setDeleteFriendDialogIsOpen}
              drawerState={isDeleteFriendDialogIsOpen}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

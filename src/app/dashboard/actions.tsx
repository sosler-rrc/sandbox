"use server";
import { getClient } from "@/lib/prisma";
import { FriendRequest } from "@/models/FriendRequest";
import { User } from "@/models/User";
import { UserFriend } from "@/models/UserFriend";

export async function SendFriendRequest(senderUserId: string, username: string) {
  const client = getClient();
  if (username.trim()) {
    const addedUser = await client.user.findUnique({
      where: {
        userName: username,
      },
    });
    if (addedUser != null) {
      if (addedUser.id == senderUserId) {
        return {
          message: "You cannot add youself as a friend",
        };
      } else {
        const existing = await client.friendRequest.findFirst({
          where: {
            receiverId: addedUser.id,
            senderId: senderUserId,
          },
        });
        if (!existing) {
          await client.friendRequest.create({
            data: {
              senderId: senderUserId,
              receiverId: addedUser.id,
            },
          });
          return {
            success: true,
            message: `Sent ${addedUser.userName} a friend request`,
          };
        } else {
          return {
            message: "You already have a pending request with this user",
          };
        }
      }
    } else {
      return {
        message: "User doesn't exist",
      };
    }
  }
}

export async function AddUserFriend(requestId: string) {
  const client = getClient();
  const request = await client.friendRequest.findFirstOrThrow({
    where: {
      id: requestId,
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  await client.userFriend.create({
    data: {
      user1Id: request.receiverId,
      user2Id: request.senderId,
    },
  });

  await client.friendRequest.delete({
    where: {
      id: requestId,
    },
  });
}

export async function CancelFriendRequest(requestId: string) {
  const client = getClient();
  await client.friendRequest.delete({
    where: {
      id: requestId,
    },
  });
}

export async function GetUserFriends(userId: string) {
  let friends = new Array<UserFriend>();

  const client = getClient();
  const userFriends = await client.userFriend.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  friends = userFriends.map((x) => {
    return {
      id: x.id,
      friendUser: x.user1Id == userId ? x.user2 : x.user1,
    };
  });

  return friends;
}

export async function GetUserSentFriendsRequests(userId: string) {
  let friendRequests = new Array<FriendRequest>();
  const client = getClient();
  const userFriendRequests = await client.friendRequest.findMany({
    where: {
      senderId: userId,
      status: "PENDING",
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  friendRequests = userFriendRequests.map<FriendRequest>((x) => {
    return {
      ...x,
    };
  });

  return friendRequests;
}

export async function GetUserReceivedFriendsRequests(userId: string) {
  let friendRequests = new Array<FriendRequest>();
  const client = getClient();
  const userFriendRequests = await client.friendRequest.findMany({
    where: {
      receiverId: userId,
      status: "PENDING",
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  friendRequests = userFriendRequests.map<FriendRequest>((x) => {
    return {
      ...x,
    };
  });

  return friendRequests;
}

export async function DeleteUserFriend(userFriendId: string) {
  const client = getClient();
  await client.userFriend.delete({
    where: {
      id: userFriendId,
    },
  });
}

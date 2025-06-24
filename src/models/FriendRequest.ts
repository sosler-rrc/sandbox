import { User } from "./User";

export interface FriendRequest {
  id: string;
  sender: User;
  receiver: User;
}

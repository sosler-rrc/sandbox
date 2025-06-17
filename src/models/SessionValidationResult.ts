import { Session } from "./Session";
import { User } from "./User";

export type SessionValidationResult = { 
  session: Session | null; 
  user: User | null 
}
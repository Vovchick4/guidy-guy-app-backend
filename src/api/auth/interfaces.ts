import { User } from "../users/users.entity";

export interface RequestWithUser {
    user: User;
}

export interface TokenPayload {
    userId: number;
}

export interface VerificationTokenPayload {
    email: string;
}

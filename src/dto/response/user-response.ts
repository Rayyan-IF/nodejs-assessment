export interface AuthUserResponse {
    name: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
}
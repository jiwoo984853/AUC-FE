export interface PostRefreshRequest {
  refreshToken: string;
}

export interface PostRefreshResponse {
  accessToken: string;
}

export interface PutUserProfileRequset {
  profileImageUrl?: string;
  nickname: string;
}

export interface PutUserProfileResponse {
  user_id: number;
  nickname: string;
  profileImageUrl: string;
  point: number;
}

export interface GetUserProfileResponse {
  user_id: number;
  nickname: string;
  profileImageUrl: string;
  point: number;
}

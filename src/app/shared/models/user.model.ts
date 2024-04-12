export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  admin: boolean;
  profile_picture_url?: string;
}

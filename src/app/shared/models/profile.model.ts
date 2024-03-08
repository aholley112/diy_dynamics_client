export interface Profile {
  id: number;
  bio: string;
  user: {
    firstName: string;
    lastName: string;
  };
  userId: number;
}

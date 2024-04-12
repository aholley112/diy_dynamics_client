import { User } from './user.model';

export interface Comment {
  id: number;
  text: string;
  user_name?: string;
  user_id: number;
  project_id: number;
  profile_picture_url?: string;
 
}


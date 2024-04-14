import { Project } from "./project.model";

export interface FavoriteProject extends Project {
  favorite_id: number;
  status: 'wantToDo' | 'done';
  
}

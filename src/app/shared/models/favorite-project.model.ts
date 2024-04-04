import { Project } from "./project.model";

export interface FavoriteProject extends Project {
  favoriteId: number;
  status: 'wantToDo' | 'done';
}

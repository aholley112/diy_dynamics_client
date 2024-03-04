export interface Project {
  id: number;
  title: string;
  description: string;
  isFavoriteProject: boolean;
  instructions: string;
  estimatedTimeToCompletion: string;
  userId: number;
}

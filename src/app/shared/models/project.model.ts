export interface Project {
  id: number;
  title: string;
  description: string;
  isFavoriteProject: boolean;
  instructions: string;
  est_time_to_completion: string;
  userId: number;
  image_url: string;
  material_names: string[];
  tool_names: string[];
}

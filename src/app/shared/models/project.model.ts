import { Category } from "./category.model";

export interface Project {
  id: number;
  title: string;
  description: string;
  is_favorite_project: boolean;
  instructions: string;
  est_time_to_completion: string;
  user_id?: number;
  image_url: string;
  material_names: string[];
  tool_names: string[];
  categories?: Category[];
  is_loading?: boolean;
}

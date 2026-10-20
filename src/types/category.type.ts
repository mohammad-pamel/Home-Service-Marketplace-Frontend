export interface Category {
  id:       string;   
  name:     string;
  slug:    string; 
  description: string;   
  isActive: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description: string;
}

export interface UpdateCategoryVariables  {
  payload: CreateCategoryPayload;
  categoryId: string;
};
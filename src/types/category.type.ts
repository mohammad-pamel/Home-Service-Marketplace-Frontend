export interface Category {
  id:       string;   
  name:     string;
  slug:    string;    
  isActive: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description: string;
}
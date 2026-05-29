export interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitness_level?: string;
  sports: string[];
  preferences: Record<string, unknown>;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  sport: string;
  category: string;
  price: number;
  currency: string;
  description?: string;
  image_url?: string;
  specs: Record<string, unknown>;
  tags: string[];
  rating: number;
  review_count: number;
}

export interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
}

export interface QuestionnaireData {
  sport: string;
  level: string;
  frequency: string;
  budget: string;
  goals: string[];
  specific_needs: Record<string, string>;
}

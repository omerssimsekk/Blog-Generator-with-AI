export interface BlogPost {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateBlogRequest {
  title?: string;
  keywords?: string[];
  perspective?: string;
}

export interface GenerateBlogResponse {
  content: string;
} 
export interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  // category: Category; // Không còn dùng nếu backend chỉ trả về categoryName
  categoryName: string;
  description?: string;
  urlImage: string;
}

export interface Category {
  id: number;
  name: string;
}

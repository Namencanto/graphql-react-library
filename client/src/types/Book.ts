export interface Book {
  id: number;
  isbn: number;
  name: string;
  author: string;
  borrowedBy: { name: string; id: number } | null;
}

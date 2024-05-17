/**
 * Response from Blog API
 * @param {any} D - expected response data type, e.g. `PostData[]`. Defaults to `undefined`.
 */
export interface ApiResponse<D = void> {
  success: boolean;
  message: string;
  errors?: {
    msg?: string;
    message?: string;
  }[];
  count?: number;
  token?: string;
  data: D extends void ? undefined : D;
}

export interface PostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    slug: string;
  };
  isPublished: boolean;
  category?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
  tags?: string[];
  displayImg?: {
    attribution?: string;
    source?: string;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

export interface CommentData {
  _id: string;
  text: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    slug: string;
  };
  post: {
    _id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string
}

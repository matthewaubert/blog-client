/**
 * @param {any} D - expected response data type, e.g. `PostData[]`
 */
export interface ApiResponse<D> {
  success: boolean;
  message: string;
  errors?: object[];
  count?: number;
  data: D;
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

import { JwtPayload } from 'jwt-decode';

/**
 * Response from Blog API
 * @param {any} D - expected response data type, e.g. `PostData[]`. Defaults to `unknown`.
 */
export interface ApiResponse<D = unknown> {
  success: boolean;
  message: string;
  errors?: {
    msg?: string;
    message?: string;
  }[];
  count?: number;
  token?: string;
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
  updatedAt: string;
}

export interface AuthData extends JwtPayload {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    slug: string;
    email: string;
    isVerified: boolean;
    isAdmin: boolean;
  };
  iat: number;
  exp: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  errors?: object[];
}

export interface PostsApiResponse extends ApiResponse {
  count: number;
  data: PostData[];
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
  }
  tags?: string[];
  displayImg?: {
    attribution?: string;
    source?: string;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}

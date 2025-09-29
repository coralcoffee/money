// Example usage of the optimized API base and query
import { 
  apiBaseQuery, 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete,
  isBaseQueryError,
  BaseQueryResult 
} from './apiBaseQuery';

// Example types for your application
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface ApiListResponse<T> {
  items: T[];
  total: number;
  page: number;
}

// Example usage with proper typing
export class UserService {
  // Get all users with proper typing
  static async getUsers(): Promise<User[] | null> {
    const result: BaseQueryResult<ApiListResponse<User>> = await apiGet<ApiListResponse<User>>(
      '/users',
      { page: 1, limit: 10 }
    );

    if (isBaseQueryError(result)) {
      console.error('Failed to fetch users:', result.error);
      return null;
    }

    return result.data.items;
  }

  // Get single user
  static async getUser(id: number): Promise<User | null> {
    const result = await apiGet<User>(`/users/${id}`);

    if (isBaseQueryError(result)) {
      console.error('Failed to fetch user:', result.error);
      return null;
    }

    return result.data;
  }

  // Create user with typed request/response
  static async createUser(userData: CreateUserRequest): Promise<User | null> {
    const result = await apiPost<User, CreateUserRequest>('/users', userData);

    if (isBaseQueryError(result)) {
      console.error('Failed to create user:', result.error);
      return null;
    }

    return result.data;
  }

  // Update user
  static async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const result = await apiPut<User, Partial<User>>(`/users/${id}`, userData);

    if (isBaseQueryError(result)) {
      console.error('Failed to update user:', result.error);
      return null;
    }

    return result.data;
  }

  // Delete user
  static async deleteUser(id: number): Promise<boolean> {
    const result = await apiDelete(`/users/${id}`);

    if (isBaseQueryError(result)) {
      console.error('Failed to delete user:', result.error);
      return false;
    }

    return true;
  }
}

// Example of using the base query directly with custom config
export async function customApiCall() {
  const result = await apiBaseQuery<{ message: string }>({
    url: '/custom-endpoint',
    method: 'POST',
    body: { action: 'process' },
    config: {
      timeout: 10000,
      headers: {
        'Custom-Header': 'value'
      }
    }
  });

  if (isBaseQueryError(result)) {
    console.error('Custom API call failed:', result.error);
    return;
  }

  console.log('Success:', result.data.message);
}

// Example error handling patterns
export async function handleApiErrors() {
  const result = await apiGet<User>('/users/123');

  if (isBaseQueryError(result)) {
    const { error } = result;
    
    switch (error.status) {
      case 401:
        console.log('User not authenticated - redirect to login');
        break;
      case 403:
        console.log('User not authorized for this resource');
        break;
      case 404:
        console.log('User not found');
        break;
      case 500:
        console.log('Server error - try again later');
        break;
      default:
        console.log('Unexpected error:', error.message);
    }
    
    return;
  }

  // Handle success case
  console.log('User data:', result.data);
}
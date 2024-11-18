import { config } from '@/config';

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

interface GitHubResponse {
  repositories?: Repository[];
  username: string;
  pagination: PaginationInfo;
}

interface Repository {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export class GitHubService {
  static readonly BASE_URL = config.api.baseUrl;

  static async getUserRepositories(username: string, page: number = 1): Promise<GitHubResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${username}/repositories?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as GitHubResponse;
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      throw error;
    }
  }
} 
import { config } from '@/config';

interface GitHubUserStats {
  repositories?: Repository[];
  username: string;
  stats: {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
  };
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

  static async getUserStats(username: string): Promise<GitHubUserStats> {
    try {
      const response = await fetch(`${this.BASE_URL}/${username}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as GitHubUserStats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
} 
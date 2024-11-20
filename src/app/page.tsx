'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GitHubService } from '@/services/github';

type SearchOption = 'repositories' | 'badge';

interface BadgeOptions {
  show_language: boolean;
  show_stars: boolean;
  show_forks: boolean;
  show_repos: boolean;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchOption, setSearchOption] = useState<SearchOption>('repositories');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [badgeOptions, setBadgeOptions] = useState<BadgeOptions>({
    show_language: true,
    show_stars: true,
    show_forks: true,
    show_repos: true,
  });
  const router = useRouter();

  useEffect(() => {
    // Verifica o tema inicial
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    // Adiciona listener para mudanças no tema
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      try {
        await GitHubService.getUserRepositories(username.trim());
        if (searchOption === 'repositories') {
          router.push(`/user/${username}`);
        } else {
          const params = new URLSearchParams();
          Object.entries(badgeOptions).forEach(([key, value]) => {
            if (!value) params.append(key, 'false');
          });
          router.push(`/badge/${username}${params.toString() ? `?${params.toString()}` : ''}`);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleOption = (option: keyof BadgeOptions) => {
    setBadgeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex justify-center mb-8">
          <Image
            src={isDarkMode ? "/github-mark-light.svg" : "/github-mark-dark.svg"}
            alt="GitHub Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            GitHub User Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a GitHub username and choose what you want to explore
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-8">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              maxLength={39}
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 
                       text-gray-900 dark:text-white bg-white dark:bg-gray-800
                       shadow-sm hover:shadow-md transition-shadow
                       disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 
                       text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 transition-colors
                       disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Search"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSearchOption('repositories')}
              className={`p-4 rounded-lg border-2 transition-all ${
                searchOption === 'repositories'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                </svg>
                <span className={`font-medium ${
                  searchOption === 'repositories'
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Repository List
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  View user&apos;s repositories
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSearchOption('badge')}
              className={`p-4 rounded-lg border-2 transition-all ${
                searchOption === 'badge'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"/>
                  <path d="M12 16c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                  <path d="M12 12l2.8-2.8m-5.6 0L12 12"/>
                </svg>
                <span className={`font-medium ${
                  searchOption === 'badge'
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Profile Badge
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Generate embeddable badge
                </span>
              </div>
            </button>
          </div>

          {searchOption === 'badge' && (
            <div className="space-y-4 p-4 border-2 rounded-lg border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Badge Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badgeOptions.show_language}
                    onChange={() => toggleOption('show_language')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 
                             focus:ring-blue-500 dark:focus:ring-blue-600 
                             dark:ring-offset-gray-800 dark:bg-gray-700 
                             dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show Language
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badgeOptions.show_stars}
                    onChange={() => toggleOption('show_stars')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 
                             focus:ring-blue-500 dark:focus:ring-blue-600 
                             dark:ring-offset-gray-800 dark:bg-gray-700 
                             dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show Stars
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badgeOptions.show_forks}
                    onChange={() => toggleOption('show_forks')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 
                             focus:ring-blue-500 dark:focus:ring-blue-600 
                             dark:ring-offset-gray-800 dark:bg-gray-700 
                             dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show Forks
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={badgeOptions.show_repos}
                    onChange={() => toggleOption('show_repos')}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 
                             focus:ring-blue-500 dark:focus:ring-blue-600 
                             dark:ring-offset-gray-800 dark:bg-gray-700 
                             dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show Repos
                  </span>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { GitHubService } from '@/services/github';
import Image from 'next/image';

export const runtime = 'edge';

interface BadgeData {
  imageUrl: string;
  markdownCode: string;
  htmlCode: string;
}

export default function BadgePage() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [badgeData, setBadgeData] = useState<BadgeData>({
    imageUrl: '',
    markdownCode: '',
    htmlCode: ''
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        const data = await GitHubService.getUserRepositories(username as string);
        const imageUrl = `${GitHubService.BASE_URL}/${username}/badge`;
        setBadgeData({
          imageUrl,
          markdownCode: `[![GitHub Stats](${imageUrl})](${GitHubService.BASE_URL}/${username})`,
          htmlCode: `<a href="${GitHubService.BASE_URL}/${username}"><img src="${imageUrl}" alt="GitHub Stats"></a>`
        });
      } catch (err) {
        setError('Failed to load user badge');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadgeData();
  }, [username]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          GitHub Stats Badge for {username}
        </h1>

        <div className="flex justify-center">
          <Image
            src={badgeData.imageUrl}
            alt={`${username}&apos;s GitHub Stats`}
            width={495}
            height={195}
            className="shadow-lg rounded-lg"
            unoptimized
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Markdown
            </h2>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  {badgeData.markdownCode}
                </code>
              </pre>
              <button
                onClick={() => copyToClipboard(badgeData.markdownCode, 'markdown')}
                className="absolute right-2 top-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {copiedField === 'markdown' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              HTML
            </h2>
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  {badgeData.htmlCode}
                </code>
              </pre>
              <button
                onClick={() => copyToClipboard(badgeData.htmlCode, 'html')}
                className="absolute right-2 top-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {copiedField === 'html' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
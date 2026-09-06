import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://taunovel.com';

  const novels = await prisma.novel.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const novelUrls = novels.map((n) => ({
    url: `${baseUrl}/novel/${n.slug}`,
    lastModified: n.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/novels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...novelUrls,
  ];
}

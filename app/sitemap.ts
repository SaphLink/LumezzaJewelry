import { MetadataRoute } from 'next';
import { generateSlug } from './utils/slug';

interface Product {
  "ID #:": number;
  Title: string;
  Description: string;
  Price: number;
}

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products.json`, {
      cache: 'no-store'
    });
    return await response.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lumezza.com';

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${generateSlug(product.Title)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...productUrls,
  ];
}

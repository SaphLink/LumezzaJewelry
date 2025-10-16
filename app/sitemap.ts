import { MetadataRoute } from 'next'
import { Product } from './types'
import { generateSlug } from './utils/slug'

async function getProducts(): Promise<Product[]> {
  try {
    const products: Product[] = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products.json`, {
      cache: 'no-store'
    }).then(res => res.json());
    return products;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  
  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `https://lumezza.com/product/${generateSlug(product.Title)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://lumezza.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...productEntries,
  ]
}

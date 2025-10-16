import { MetadataRoute } from 'next'
import { Product } from './types'
import { generateSlug } from './utils/slug'
import fs from 'fs'
import path from 'path'

async function getProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'products.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const products: Product[] = JSON.parse(fileContents);
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

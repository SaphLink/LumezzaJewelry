import { Product } from '../types';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function findProductBySlug(products: Product[], slug: string) {
  return products.find(product => {
    const productSlug = generateSlug(product.Title);
    return productSlug === slug;
  });
}

export function findProductById(products: Product[], id: number) {
  return products.find(product => product["ID #:"] === id);
}

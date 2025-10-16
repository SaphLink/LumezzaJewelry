'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';
import { findProductBySlug } from '../../utils/slug';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Fetch products first
        const response = await fetch('/products.json');
        const products = await response.json();
        
        // Find the product by slug
        const productData = findProductBySlug(products, resolvedParams.slug);
        if (productData) {
          setProduct(productData);
          // Count images by checking if they exist
          let count = 0;
          for (let i = 1; i <= 20; i++) {
            try {
              const response = await fetch(`/products/${resolvedParams.slug}/image-${i}.png`, { method: 'HEAD' });
              if (response.ok) {
                count = i;
              } else {
                break;
              }
            } catch {
              break;
            }
          }
          setImageCount(count);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [resolvedParams.slug]);

  const nextImage = () => {
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount);
    }
  };

  const prevImage = () => {
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-blush)] to-[var(--color-sand)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)] mx-auto mb-4"></div>
          <p className="text-[var(--color-charcoal)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-blush)] to-[var(--color-sand)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-4">Product Not Found</h1>
          <Link href="/" className="text-[var(--color-gold)] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-blush)] to-[var(--color-sand)]">
        {/* Logo in top right */}
        <div className="absolute top-4 right-4 z-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Lumezza Jewelry Logo"
              width={60}
              height={24}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-6 sm:mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[var(--color-charcoal)] hover:text-[var(--color-gold)] transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                  <div 
                    className="relative w-full h-96 sm:h-[500px] bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                    onClick={openModal}
                  >
                    <Image
                      src={`/products/${resolvedParams.slug}/image-${currentImageIndex + 1}.png`}
                      alt={product.Title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {imageCount > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {Array.from({ length: imageCount }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index
                            ? 'border-[var(--color-gold)] shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={`/products/${resolvedParams.slug}/image-${index + 1}.png`}
                          alt={`${product.Title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation Arrows */}
                {imageCount > 1 && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={prevImage}
                      className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-[var(--color-charcoal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-[var(--color-charcoal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-charcoal)] mb-4">
                    {product.Title}
                  </h1>
                  <div className="text-2xl sm:text-3xl font-bold text-[var(--color-gold)] mb-6">
                    ${product.Price}
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-[var(--color-charcoal)]">Product Description</h2>
                  <div 
                    className="text-[var(--color-charcoal)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.Description }}
                  />
                </div>


                {/* Contact Form */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-6">
                    <span className="text-[var(--color-gold)]">Contact Us About</span> This Piece!
                  </h2>
                  
                  <form 
                    action="https://formspree.io/f/xpwgkqgk" 
                    method="POST"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                        style={{ 
                          backgroundColor: 'white',
                          textAlign: 'center',
                        }}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                        style={{ 
                          backgroundColor: 'white',
                          textAlign: 'center',
                        }}
                        required
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone Number"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                      style={{ 
                        backgroundColor: 'white',
                        textAlign: 'center',
                      }}
                    />
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg resize-none"
                      style={{ 
                        backgroundColor: 'white',
                        textAlign: 'left',
                      }}
                      defaultValue={`I am reaching out in regards to the product, ${product.Title}.
 
My name is `}
                      required
                    ></textarea>
                    <input type="hidden" name="_to" value="zivwand@gmail.com" />
                    <input type="hidden" name="_subject" value={`Lumezza Jewelry Inquiry - ${product.Title}`} />
                    <button
                      type="submit"
                      className="w-full bg-[var(--color-gold)] hover:bg-[var(--color-gold)]/90 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-colors text-base sm:text-lg"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[var(--color-charcoal)] text-white py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Image
                src="/logo.png"
                alt="Lumezza Jewelry Logo"
                width={120}
                height={48}
                className="opacity-90"
              />
              <p className="text-sm sm:text-base opacity-70">
                © 2025 Lumezza Jewelry. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Image Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={zoomOut}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              <Image
                src={`/products/${resolvedParams.slug}/image-${currentImageIndex + 1}.png`}
                alt={`${product.Title} - Zoomed`}
                width={800}
                height={800}
                className="object-contain w-full h-auto"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

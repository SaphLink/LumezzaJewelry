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
    // Fetch product data
    fetch('/products.json')
      .then(res => res.json())
      .then((products: Product[]) => {
        const foundProduct = findProductBySlug(products, resolvedParams.slug);
        setProduct(foundProduct || null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // Count images
    const countImages = async () => {
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
    };

    countImages();
  }, [resolvedParams.slug]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-sand)' }}>
        <p style={{ color: 'var(--color-charcoal)' }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-sand)' }}>
        <div className="text-center">
          <h1 className="text-3xl mb-4" style={{ color: 'var(--color-charcoal)' }}>Product not found</h1>
          <Link href="/" className="underline" style={{ color: 'var(--color-cream)' }}>
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Update document title and meta tags dynamically
  useEffect(() => {
    if (product) {
      document.title = `${product.Title} - $${product.Price.toLocaleString()} | Lumezza Jewelry`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `${product.Title} - $${product.Price.toLocaleString()}. ${product.Description.substring(0, 160)}...`);
      
      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', `${product.Title} - Lumezza Jewelry`);
      
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', `${product.Title} - $${product.Price.toLocaleString()}. ${product.Description.substring(0, 160)}...`);
      
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', `${window.location.origin}/products/${resolvedParams.slug}/image-1.png`);
    }
  }, [product, resolvedParams.slug]);

  return (
    <>
      {/* JSON-LD Structured Data for Product */}
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.Title,
              "description": product.Description.substring(0, 200),
              "image": `${typeof window !== 'undefined' ? window.location.origin : 'https://lumezza.com'}/products/${resolvedParams.slug}/image-1.png`,
              "brand": {
                "@type": "Brand",
                "name": "Lumezza Jewelry"
              },
              "offers": {
                "@type": "Offer",
                "price": product.Price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": `${typeof window !== 'undefined' ? window.location.href : 'https://lumezza.com/product/' + resolvedParams.slug}`,
                "seller": {
                  "@type": "Organization",
                  "name": "Lumezza Jewelry"
                }
              },
              "category": "Jewelry"
            })
          }}
        />
      )}
      <main className="min-h-screen luxury-background" style={{ backgroundColor: 'var(--background)' }}>
        {/* Breadcrumb Schema */}
        {product && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": typeof window !== 'undefined' ? window.location.origin : 'https://lumezza.com'
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product.Title,
                    "item": typeof window !== 'undefined' ? window.location.href : `https://lumezza.com/product/${resolvedParams.slug}`
                  }
                ]
              })
            }}
          />
        )}
        
        {/* Header with Logo and Back Button */}
        <header className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto mb-4">
            <ol className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-charcoal)' }}>
              <li>
                <Link href="/" className="hover:underline opacity-70 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li className="opacity-50">/</li>
              <li className="opacity-70">
                {product ? product.Title.substring(0, 50) + (product.Title.length > 50 ? '...' : '') : 'Product'}
              </li>
            </ol>
          </nav>
          
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <Link href="/" className="inline-flex items-center glass-effect rounded-2xl hover:scale-105 transition-all duration-300 luxury-shadow border-gradient group" style={{ color: 'var(--color-charcoal)', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '8px 24px', margin: '20px 0 20px 20px' }}>
              <div className="glass-effect rounded-full p-2 transition-all duration-300 group-hover:rotate-180" style={{ backgroundColor: 'var(--color-gold)', marginRight: '12px' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="font-semibold text-lg">Back to Collection</span>
            </Link>
            
            <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="Lumezza Jewelry" 
                width={80} 
                height={32} 
                className="flex-shrink-0 w-16 sm:w-20 md:w-24 h-auto"
              />
            </Link>
          </div>
        </header>

        {/* Product Section */}
        <section className="py-8 sm:py-12 px-8 sm:px-12 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              
              {/* Image Slideshow */}
              <div className="space-y-6">
                <div 
                  className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={handleOpenModal}
                >
                  {imageCount > 0 && (
                    <Image
                      src={`/products/${resolvedParams.slug}/image-${currentImageIndex + 1}.png`}
                      alt={`${product.Title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  )}
                  
                  {/* Hover Overlay with Zoom Icon */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="bg-white/90 rounded-full p-4 shadow-lg">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {imageCount > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {imageCount > 1 && (
                  <div className="flex gap-3 overflow-x-auto">
                    {Array.from({ length: imageCount }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === i 
                            ? 'border-[var(--color-gold)]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={`/products/${resolvedParams.slug}/image-${i + 1}.png`}
                          alt={`${product.Title} - View ${i + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6 sm:space-y-8 product-info-mobile" style={{ marginTop: '20px sm:30px' }}>
                {/* Title & Price */}
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 product-title-mobile" style={{ color: 'var(--color-charcoal)' }}>
                    {product.Title}
                  </h1>
                  <p className="text-3xl sm:text-4xl font-bold product-price-mobile" style={{ color: '#b8860b', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
                    ${product.Price.toLocaleString()}
                  </p>
                </div>
                
                {/* Description */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 product-description-heading-mobile" style={{ color: '#b8860b', textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                    Product Description
                  </h2>
                  <div 
                    className="whitespace-pre-line leading-relaxed text-base sm:text-lg lg:text-xl font-medium product-description-text-mobile"
                    style={{ color: 'var(--color-charcoal)', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}
                    dangerouslySetInnerHTML={{
                      __html: product.Description
                        .replace(/^Details:/gm, '<h3 style="color: #b8860b; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); font-size: 1.25rem; font-weight: 600; margin-bottom: -2.5rem;">Product Details:</h3>')
                        .replace(/(?<=Product Details:[\s\S]*?)([A-Z][^:]+:[^\n]*(?:\n(?!\n)[^A-Z][^\n]*)*)/gm, '<div style="margin-bottom: -0.5rem; line-height: 1.2; text-indent: -1.2em; padding-left: 1.2em;">• $1</div>')
                        .replace(/(?<=Product Details:[\s\S]*?)(This [^.]*\.)/gm, '<div style="margin-top: -3rem;">$1</div>')
                    }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative overflow-hidden py-12 sm:py-16 md:py-20" style={{ backgroundColor: 'var(--background)', marginTop: '84px' }}>
          {/* Elegant background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-gold) 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, var(--color-cream) 1px, transparent 1px)`,
              backgroundSize: '60px 60px, 40px 40px'
            }}></div>
          </div>
          
          <div className="relative w-full flex flex-col items-center px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-shadow text-center" style={{ marginBottom: '16px sm:20px' }}>
              <span style={{ color: '#b8860b' }}>Contact Us About </span>
              <span style={{ color: 'var(--color-charcoal)' }}>This Piece!</span>
            </h2>
            
            <form 
              action="https://formspree.io/f/xpzqkqkp" 
              method="POST" 
              className="w-full max-w-sm sm:max-w-md md:max-w-xl space-y-6 sm:space-y-8"
            >
              <input 
                type="text" 
                name="name"
                placeholder="Your Name" 
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                style={{ 
                  backgroundColor: 'white',
                  textAlign: 'center',
                  '::placeholder': { textAlign: 'center' }
                }}
                required
              />
              <input 
                type="email" 
                name="email"
                placeholder="Your E-Mail" 
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                style={{ 
                  backgroundColor: 'white',
                  textAlign: 'center',
                  '::placeholder': { textAlign: 'center' }
                }}
                required
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Your Phone Number" 
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg"
                style={{ 
                  backgroundColor: 'white',
                  textAlign: 'center',
                  '::placeholder': { textAlign: 'center' }
                }}
              />
              <textarea 
                name="message"
                placeholder="Your Message" 
                rows={4}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-base sm:text-lg resize-none"
                style={{ 
                  backgroundColor: 'left',
                  textAlign: 'left',
                  '::placeholder': { textAlign: 'left' }
                }}
                defaultValue={`I am reaching out in regards to the product, ${product.Title}.
 
My name is `}
                required
              ></textarea>
              <input type="hidden" name="_to" value="zivwand@gmail.com" />
              <input type="hidden" name="_subject" value={`Lumezza Jewelry Inquiry - ${product.Title}`} />
              <button 
                type="submit"
                className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg"
                style={{ backgroundColor: 'var(--color-charcoal)' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 sm:pb-12 border-t border-gray-200/50" style={{ paddingTop: '64px' }}>
          <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Image 
                src="/logo.png" 
                alt="Lumezza Jewelry" 
                width={120} 
                height={48} 
                className="opacity-80 w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
              />
              <p className="text-xs sm:text-sm opacity-70 text-center sm:text-left" style={{ color: 'var(--color-charcoal)' }}>
                © 2025 Lumezza Jewelry. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Zoom Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
            <div className="relative max-w-4xl max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={zoomOut}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all mr-2"
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

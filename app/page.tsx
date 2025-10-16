import Image from 'next/image';
import Link from 'next/link';
import { Product } from './types';
import { generateSlug } from './utils/slug';

async function getProducts(): Promise<Product[]> {
  try {
    // Use import instead of fetch for better reliability in production
    const products = await import('../public/products.json');
    return products.default as Product[];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen luxury-background">
      {/* Header */}
      <header className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-gold) 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, var(--color-cream) 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 40px 40px'
          }}></div>
        </div>
        
        <div className="relative w-full flex flex-col md:flex-row items-center md:justify-center px-4 sm:px-6 md:px-8" style={{ gap: '0' }}>
          {/* Mobile/Tablet: Logo above text, Desktop: Logo to the left */}
          <div className="flex justify-center w-full md:w-auto">
            <Image 
              src="/logo.png" 
              alt="Lumezza Jewelry - Elevated Jewelry, Normalized Pricing" 
              width={220} 
              height={88} 
              className="flex-shrink-0 w-40 sm:w-48 h-auto md:w-56 lg:w-64"
              style={{ marginBottom: '-16px', marginRight: '-30px' }}
              priority
            />
          </div>
          <div className="text-center md:text-left md:ml-[-80px]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-shadow leading-tight">
              <span style={{ color: '#b8860b' }}>Elevated Jewelry,</span><br />
              <span style={{ color: 'var(--color-charcoal)' }}>Normalized Pricing.</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg opacity-80" style={{ color: 'var(--color-charcoal)' }}>
              <span style={{ fontWeight: 700 }}>Discover timeless elegance at accessible prices.</span> <br className="sm:hidden" /><strong style={{ fontWeight: 900, letterSpacing: '1px', WebkitTextStroke: '0.5px currentColor' }}>Lumezza Jewelry.</strong>
            </p>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <section className="w-full pb-20 sm:pb-28 md:pb-36 relative" style={{ paddingTop: '40px' }}>
        <div className="w-full flex flex-col items-center px-16 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-xs sm:max-w-3xl lg:max-w-4xl">
                 {products.map((product) => {
                   const productSlug = generateSlug(product.Title);
                   return (
                     <Link 
                       key={product["ID #:"]} 
                       href={`/product/${productSlug}`}
                       className="group w-full"
                     >
                <div className="luxury-shadow glass-effect rounded-2xl overflow-hidden border-gradient">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
          <Image
                      src={`/products/${product["ID #:"]}/image-1.png`}
                      alt={`${product.Title} - $${product.Price.toLocaleString()} - Lumezza Jewelry`}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    
                    {/* Price tag overlay */}
                    <div className="absolute top-2 left-4 rounded-full" style={{ backgroundColor: '#1a1a1a', padding: '4px 16px', border: '1px solid #333', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)' }}>
                      <p className="text-xl font-bold" style={{ color: '#ffffff' }}>
                        ${product.Price.toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Elegant overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Title and link section */}
                  <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-16 sm:pb-20 text-center">
                    <h3 className="text-base sm:text-lg font-medium leading-tight mb-3" style={{ color: 'var(--color-charcoal)' }}>
                      {product.Title}
                    </h3>
                    <div style={{ height: '10px' }}></div>
                    <div className="inline-flex items-center text-sm sm:text-base font-semibold rounded-full" style={{ backgroundColor: 'var(--color-gold)', color: 'white', padding: '4px 16px' }}>
                      <span style={{ marginRight: '8px' }}>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div style={{ height: '16px' }}></div>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20" style={{ backgroundColor: 'var(--background)', marginTop: '50px' }}>
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
            <span style={{ color: '#b8860b' }}>Contact Us </span>
            <span style={{ color: 'var(--color-charcoal)' }}>Today!</span>
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
                     }}
                   />
                   <textarea 
                     name="message"
                     placeholder="Your Message" 
                     rows={4}
                     className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[var(--color-gold)] text-lg resize-none"
                     style={{ 
                       backgroundColor: 'white',
                       textAlign: 'center',
                     }}
                     required
                   ></textarea>
                   <input type="hidden" name="_to" value="zivwand@gmail.com" />
                   <input type="hidden" name="_subject" value="Lumezza Jewelry Contact Form Submission" />
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
      <footer className="pb-8 sm:pb-12 border-t border-gray-200/50" style={{ marginTop: '60px' }}>
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
    </main>
  );
}
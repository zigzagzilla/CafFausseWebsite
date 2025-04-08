import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/lightbox";
import ribeyeSteak from "@assets/gallery-ribeye-steak.webp";
import cafeInterior from "@assets/gallery-cafe-interior.webp";
import specialEvent from "@assets/gallery-special-event.webp";

type GalleryCategory = "all" | "food" | "ambiance" | "events";

// Gallery items data
const galleryItems = [
  {
    id: 1,
    category: "food",
    image: ribeyeSteak,
    imageHigh: ribeyeSteak, // Using the same high-quality imported image
    title: "Signature Dish",
    description: "Chef's special ribeye steak"
  },
  {
    id: 2,
    category: "food",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    imageHigh: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=90",
    title: "Artful Dessert",
    description: "Decadent tiramisu or cheesecake"
  },
  {
    id: 3,
    category: "ambiance",
    image: cafeInterior,
    imageHigh: cafeInterior, // Using the same high-quality imported image
    title: "Dining Room",
    description: "Elegant atmosphere for your meal"
  },
  {
    id: 4,
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    imageHigh: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=90",
    title: "Fine Wines",
    description: "Extensive selection of premium wines"
  },
  {
    id: 5,
    category: "events",
    image: specialEvent,
    imageHigh: specialEvent, // Using the same high-quality imported image
    title: "Events",
    description: "Perfect setting for elegant gatherings"
  },
  {
    id: 6,
    category: "events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    imageHigh: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=90",
    title: "Chef's Table",
    description: "Exclusive culinary experience"
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    text: "An extraordinary dining experience from start to finish. The attention to detail in both food and service was impeccable. The vegetable risotto was the best I've ever tasted.",
    author: "Sarah M."
  },
  {
    id: 2,
    text: "We celebrated our anniversary at Café Fausse and it exceeded all expectations. The ribeye steak was cooked to perfection and the wine pairing suggestions were spot on.",
    author: "David & Caroline R."
  },
  {
    id: 3,
    text: "The ambiance, the food, the service—everything was exceptional. Chef Marie's culinary vision is evident in every dish. The tiramisu is worth the visit alone!",
    author: "Michael T."
  }
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    src: "",
    alt: ""
  });

  const openLightbox = (imageSrc: string, imageAlt: string) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const filteredGalleryItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-20 bg-[#F5F2EA]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#8A2633] mb-4">Gallery</h2>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-8"></div>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Explore the ambiance, culinary creations, and memorable moments at Café Fausse.
          </p>
        </div>
        
        {/* Gallery Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeCategory === "all"
                ? "bg-white text-[#8A2633] border-[#8A2633]"
                : "hover:bg-white text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeCategory === "food"
                ? "bg-white text-[#8A2633] border-[#8A2633]"
                : "hover:bg-white text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveCategory("food")}
          >
            Food
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeCategory === "ambiance"
                ? "bg-white text-[#8A2633] border-[#8A2633]"
                : "hover:bg-white text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveCategory("ambiance")}
          >
            Ambiance
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeCategory === "events"
                ? "bg-white text-[#8A2633] border-[#8A2633]"
                : "hover:bg-white text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveCategory("events")}
          >
            Events
          </button>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleryItems.map(item => (
            <div key={item.id} className="gallery-item">
              <div 
                className="relative overflow-hidden rounded-sm shadow-md group cursor-pointer"
                onClick={() => openLightbox(item.imageHigh || item.image, item.title)}
                role="button"
                tabIndex={0}
                aria-label={`View larger image of ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(item.imageHigh || item.image, item.title);
                  }
                }}
              >
                <img 
                  src={item.image}
                  alt={item.title} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-[#8A2633] bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="font-serif text-xl font-semibold mb-2">{item.title}</h4>
                    <p>{item.description}</p>
                    <span className="mt-2 inline-block px-4 py-1 border border-white rounded-sm text-sm">Click to enlarge</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        <Lightbox 
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          imageSrc={selectedImage.src}
          imageAlt={selectedImage.alt}
        />
        
        {/* Awards Section */}
        <div className="mt-20">
          <h3 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6 text-center">Awards</h3>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-sm shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F2EA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B49A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#8A2633] text-center mb-3">Culinary Excellence Award</h4>
              <p className="text-[#333333] text-center mb-2">2022</p>
              <p className="text-[#333333] text-center">Recognized for our outstanding culinary creativity and execution.</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F2EA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B49A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#8A2633] text-center mb-3">Restaurant of the Year</h4>
              <p className="text-[#333333] text-center mb-2">2023</p>
              <p className="text-[#333333] text-center">Voted the premier dining establishment in the region.</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F2EA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B49A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="font-serif text-xl font-semibold text-[#8A2633] text-center mb-3">Best Fine Dining Experience</h4>
              <p className="text-[#333333] text-center mb-2">Foodie Magazine, 2023</p>
              <p className="text-[#333333] text-center">Acclaimed for our exceptional service, atmosphere and culinary delights.</p>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-20">
          <h3 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6 text-center">Reviews</h3>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-sm shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F2EA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B49A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-[#333333] text-center italic mb-4 text-lg">
                "Exceptional ambiance and unforgettable flavors."
              </p>
              <p className="text-[#8A2633] font-semibold text-center">– Gourmet Review</p>
            </div>
            
            <div className="bg-white p-6 rounded-sm shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#F5F2EA]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#B49A5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-[#333333] text-center italic mb-4 text-lg">
                "A must-visit restaurant for food enthusiasts."
              </p>
              <p className="text-[#8A2633] font-semibold text-center">– The Daily Bite</p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mt-20">
          <h3 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6 text-center">What Our Guests Say</h3>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-6 rounded-sm shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#B49A5B]">
                    {Array(5).fill(0).map((_, index) => (
                      <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-[#333333] mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="text-[#8A2633] font-semibold">{testimonial.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

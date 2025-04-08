import { useState } from "react";
import { cn } from "@/lib/utils";

type GalleryCategory = "all" | "food" | "ambiance" | "events";

// Gallery items data
const galleryItems = [
  {
    id: 1,
    category: "food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Signature Dish",
    description: "Chef's special creation"
  },
  {
    id: 2,
    category: "food",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Artful Dessert",
    description: "Sweet masterpiece by our pastry chef"
  },
  {
    id: 3,
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Dining Room",
    description: "Elegant atmosphere for your meal"
  },
  {
    id: 4,
    category: "ambiance",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Wine Bar",
    description: "Extensive selection of fine wines"
  },
  {
    id: 5,
    category: "events",
    image: "https://images.unsplash.com/photo-1470753937643-efeb931202a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    title: "Private Dining",
    description: "Perfect for special celebrations"
  },
  {
    id: 6,
    category: "events",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
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
              <div className="relative overflow-hidden rounded-sm shadow-md group cursor-pointer">
                <img 
                  src={item.image}
                  alt={item.title} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-[#8A2633] bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="font-serif text-xl font-semibold mb-2">{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn, formatPrice } from "@/lib/utils";
import { MenuCategory, MenuItem } from "@shared/schema";

type TabType = "starters" | "main" | "desserts" | "beverages";

const Menu = () => {
  const [activeTab, setActiveTab] = useState<TabType>("starters");

  // Fetch menu data from API
  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ["/api/menu"],
  });

  // Helper to get the active menu category
  const getActiveCategory = () => {
    if (!menuData) return [];
    const category = menuData.find((cat: MenuCategory) => cat.category === activeTab);
    return category ? category.items : [];
  };

  return (
    <section className="py-20 bg-[#FCFBF7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#8A2633] mb-4">Our Menu</h2>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-8"></div>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Explore our carefully curated selection of dishes, crafted with the finest seasonal ingredients and culinary expertise.
          </p>
        </div>
        
        {/* Menu Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeTab === "starters"
                ? "bg-[#F5F2EA] text-[#8A2633] border-[#8A2633]"
                : "hover:bg-[#F5F2EA] text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveTab("starters")}
          >
            Starters
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeTab === "main"
                ? "bg-[#F5F2EA] text-[#8A2633] border-[#8A2633]"
                : "hover:bg-[#F5F2EA] text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveTab("main")}
          >
            Main Courses
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeTab === "desserts"
                ? "bg-[#F5F2EA] text-[#8A2633] border-[#8A2633]"
                : "hover:bg-[#F5F2EA] text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveTab("desserts")}
          >
            Desserts
          </button>
          <button 
            className={cn(
              "px-6 py-2 font-semibold border-b-2 focus:outline-none",
              activeTab === "beverages"
                ? "bg-[#F5F2EA] text-[#8A2633] border-[#8A2633]"
                : "hover:bg-[#F5F2EA] text-[#333333] hover:text-[#8A2633] border-transparent hover:border-[#8A2633]"
            )}
            onClick={() => setActiveTab("beverages")}
          >
            Beverages
          </button>
        </div>
        
        {/* Menu Content */}
        <div className="menu-content max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-[#333333]">Loading menu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading menu. Please try again.</p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-semibold text-[#8A2633] mb-8 text-center capitalize">{activeTab}</h3>
              <div className="space-y-8">
                {getActiveCategory().map((item: MenuItem) => (
                  <div key={item.id} className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl font-medium text-[#333333] italic">{item.name}</h4>
                      <span className="text-[#8A2633] font-semibold">${formatPrice(item.price)}</span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="text-center mt-16">
          <Link 
            href="/reservations" 
            className="inline-block px-8 py-3 bg-[#8A2633] text-white font-semibold rounded-sm hover:bg-opacity-90 transition duration-300"
          >
            Make a Reservation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;

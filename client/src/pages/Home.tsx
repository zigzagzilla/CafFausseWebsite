import { Link } from "wouter";
import NewsletterForm from "@/components/NewsletterForm";

const Home = () => {
  return (
    <section className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-[#333333] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Fine dining ambiance" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">Exquisite Cuisine, Unforgettable Experience</h1>
            <p className="text-lg md:text-xl text-[#F5F2EA] mb-8">Indulge in a culinary journey crafted with passion and precision</p>
            <Link href="/reservations" className="inline-block px-8 py-3 bg-[#8A2633] text-white font-semibold rounded-sm hover:bg-opacity-90 transition duration-300">
              Reserve a Table
            </Link>
          </div>
        </div>
      </div>
      
      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#8A2633] mb-6">Welcome to Café Fausse</h2>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-8"></div>
          <p className="text-lg text-[#333333] mb-8">
            Where culinary artistry meets warm hospitality. Our chefs combine classical techniques with innovative flavors to create dishes that delight the senses and nourish the soul.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-[#F5F2EA] p-6 rounded-sm shadow-sm flex-1 max-w-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B49A5B] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-serif text-xl font-semibold mb-2">Hours</h3>
              <p className="text-[#333333]">Monday–Saturday: 5:00PM – 11:00 PM</p>
              <p className="text-[#333333]">Sunday: 5:00 PM – 9:00 PM</p>
            </div>
            <div className="bg-[#F5F2EA] p-6 rounded-sm shadow-sm flex-1 max-w-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B49A5B] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-serif text-xl font-semibold mb-2">Location</h3>
              <p className="text-[#333333]">1234 Culinary Ave, Suite 100</p>
              <p className="text-[#333333]">Washington, DC 20002</p>
            </div>
            <div className="bg-[#F5F2EA] p-6 rounded-sm shadow-sm flex-1 max-w-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#B49A5B] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="font-serif text-xl font-semibold mb-2">Contact</h3>
              <p className="text-[#333333]">(202) 555-4567</p>
              <p className="text-[#333333]">info@cafefausse.com</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Section */}
      <div className="bg-[#F5F2EA] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Chef preparing a gourmet dish" 
                className="rounded-sm shadow-lg w-full h-auto object-cover" 
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6">Crafted with Passion</h2>
              <div className="w-16 h-0.5 bg-[#B49A5B] mb-8"></div>
              <p className="text-lg text-[#333333] mb-6">
                Our culinary team combines classic techniques with innovative approaches to create dishes that excite and inspire. We source only the finest seasonal ingredients from local farms and purveyors.
              </p>
              <p className="text-lg text-[#333333] mb-8">
                Each plate is a canvas for artistic expression, ensuring that your dining experience is not just a meal, but a memorable journey through flavors and textures.
              </p>
              <Link href="/menu" className="inline-block px-8 py-3 border-2 border-[#8A2633] text-[#8A2633] font-semibold rounded-sm hover:bg-[#8A2633] hover:text-white transition duration-300">
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-[#8A2633] rounded-sm p-8 md:p-12 text-center">
          <h2 className="font-serif text-3xl font-semibold text-white mb-4">Stay Connected</h2>
          <p className="text-[#F5F2EA] mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on special events, seasonal menus, and exclusive offers.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
};

export default Home;

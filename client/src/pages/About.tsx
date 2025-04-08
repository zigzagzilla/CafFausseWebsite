import jamesWilliamsImage from '../assets/james-williams.png';

const About = () => {
  return (
    <section className="py-20 bg-[#FCFBF7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#8A2633] mb-4">About Us</h2>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-8"></div>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            The story of Café Fausse, our culinary philosophy, and the talented team behind our exceptional dining experience.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h3 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6">Our Story</h3>
            <div className="w-16 h-0.5 bg-[#B49A5B] mb-8"></div>
            <div className="space-y-4 text-[#333333]">
              <p>
                Founded in 2010 by Chef Antonio‬ Rossi and‬ restaurateur Maria Lopez, Café Fausse blends traditional Italian flavors‬ with modern culinary innovation. Our mission is to provide an‬ unforgettable dining experience that reflects both quality and creativity.‬
              </p>
              <p>
                The name "Fausse," meaning "false" in French, reflects our playful approach to cuisine—dishes that appear simple but reveal complex flavors and unexpected elements upon tasting.
              </p>
              <p>
                Over the years, we've grown into a destination for food enthusiasts seeking innovative yet approachable fine dining in Washington DC. Our commitment to sustainable sourcing and seasonal ingredients has earned us recognition in the culinary community.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Café Fausse interior" 
              className="rounded-sm shadow-lg w-full h-auto" 
            />
          </div>
        </div>
        
        {/* Our Team */}
        <h3 className="font-serif text-3xl font-semibold text-[#8A2633] mb-6 text-center">Meet Our Team</h3>
        <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Chef Antonio Rossi" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#8A2633] mb-2">Chef Antonio Rossi</h4>
            <p className="text-[#B49A5B] font-medium mb-4">Executive Chef & Co-Founder</p>
            <p className="text-[#333333]">
              With training from prestigious Italian culinary schools and experience in Michelin-starred restaurants, Antonio brings authentic Italian flavors and modern techniques to Café Fausse.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Maria Lopez" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#8A2633] mb-2">Maria Lopez</h4>
            <p className="text-[#B49A5B] font-medium mb-4">Restaurateur & Co-Founder</p>
            <p className="text-[#333333]">
              With a keen eye for hospitality excellence and business acumen, Maria creates the perfect atmosphere and ensures every guest experiences the unique charm of Café Fausse.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden">
              <img 
                src={jamesWilliamsImage}
                alt="James Williams" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#8A2633] mb-2">James Williams</h4>
            <p className="text-[#B49A5B] font-medium mb-4">Head Sommelier</p>
            <p className="text-[#333333]">
              A certified sommelier with a passion for discovering hidden gems from small vineyards, James curates our wine selection to perfectly complement our menu.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Sophia Chen" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h4 className="font-serif text-xl font-semibold text-[#8A2633] mb-2">Sophia Chen</h4>
            <p className="text-[#B49A5B] font-medium mb-4">Pastry Chef</p>
            <p className="text-[#333333]">
              A master of both classical and innovative desserts, Sophia brings artistry and precision to our dessert menu, creating memorable final courses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

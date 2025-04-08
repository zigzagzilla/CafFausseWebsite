import ReservationForm from "@/components/ReservationForm";

const Reservations = () => {
  return (
    <section className="py-20 bg-[#F5F2EA]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#8A2633] mb-4">Reservations</h2>
          <div className="w-16 h-0.5 bg-[#B49A5B] mx-auto mb-8"></div>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Reserve your table for an unforgettable dining experience at Café Fausse.
          </p>
        </div>
        
        <ReservationForm />
      </div>
    </section>
  );
};

export default Reservations;

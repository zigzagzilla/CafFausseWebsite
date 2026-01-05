import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateTimeSlots, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Generate time slots
const timeSlots = generateTimeSlots();

// Define the form schema with zod validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please select a valid date",
  }),
  time: z.string().min(1, "Please select a time"),
  guests: z.string().or(z.number()).transform(val => Number(val)),
  specialRequests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReservationForm = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [assignedTable, setAssignedTable] = useState<number | null>(null);
  
  // Create the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      specialRequests: "",
    },
  });
  
  // Set up the reservation submission mutation
  const reservationMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/reservations", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      setShowSuccess(true);
      setAssignedTable(data.reservation?.tableNumber || null);
      toast({
        title: "Reservation Successful",
        description: data.message || "We've received your reservation request.",
      });
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "There was an error with your reservation. Please try again.";
      const isFullyBooked = errorMessage.includes("fully booked");
      toast({
        title: isFullyBooked ? "Time Slot Unavailable" : "Reservation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setShowSuccess(false);
    setAssignedTable(null);
    reservationMutation.mutate(data);
  };

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-sm shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Number of Guests</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]">
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Person" : "People"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={today}
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[#333333] font-medium mb-2">Time</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant="outline"
                          className={cn(
                            "reservation-time-btn text-center py-2 border border-gray-300 rounded-sm hover:bg-[#8A2633] hover:text-white focus:outline-none",
                            field.value === time ? "bg-[#8A2633] text-white" : ""
                          )}
                          onClick={() => field.onChange(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel className="block text-[#333333] font-medium mb-2">Special Requests (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#8A2633]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-center">
              <Button
                type="submit"
                className="px-8 py-3 bg-[#8A2633] text-white font-semibold rounded-sm hover:bg-opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={reservationMutation.isPending}
              >
                {reservationMutation.isPending ? "Processing..." : "Reserve Now"}
              </Button>
            </div>
            
            {/* Success Message */}
            {showSuccess && (
              <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-sm text-center">
                <p className="font-semibold mb-2">Thank you for your reservation!</p>
                {assignedTable && (
                  <p className="text-lg font-bold">You have been assigned Table {assignedTable}</p>
                )}
                <p className="mt-2">We've sent a confirmation email with details. We look forward to serving you.</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReservationForm;

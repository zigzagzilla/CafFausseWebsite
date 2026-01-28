import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, Users, Mail, Phone, Trash2, Plus, Lock } from "lucide-react";
import type { Reservation, InsertReservation } from "@shared/schema";

function timeLabelTo24Hour(timeLabel: string): string {
  const m = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return "19:00";
  let hour = parseInt(m[1], 10);
  const minute = m[2];
  const period = m[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

type NewReservationFormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
};

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // State for new reservation form - must be declared before any conditional returns
  const [newReservation, setNewReservation] = useState<NewReservationFormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: ""
  });

  // Fetch all reservations - must be declared before any conditional returns
  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  // Create reservation mutation - must be declared before any conditional returns
  const createReservationMutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      const response = await fetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create reservation");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      setNewReservation({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        specialRequests: ""
      });
      toast({
        title: "Success",
        description: "Reservation created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create reservation",
        variant: "destructive",
      });
    },
  });

  // Cancel reservation mutation - must be declared before any conditional returns
  const cancelReservationMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel reservation");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      toast({
        title: "Success",
        description: "Reservation cancelled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel reservation",
        variant: "destructive",
      });
    },
  });
  
  // Simple authentication (in a real app, this would be more secure)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simple password check (replace with your preferred admin password)
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
    setIsLoggingIn(false);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const hhmm = timeLabelTo24Hour(newReservation.time);
    const time_slot = `${newReservation.date}T${hhmm}:00`;
    const payload: InsertReservation = {
      name: newReservation.name,
      email: newReservation.email,
      phone: newReservation.phone?.trim() || undefined,
      time_slot,
      guests: newReservation.guests,
      specialRequests: newReservation.specialRequests || undefined,
    };

    createReservationMutation.mutate(payload);
  };

  const handleCancelReservation = (id: number, customerName: string) => {
    if (window.confirm(`Are you sure you want to cancel ${customerName}'s reservation?`)) {
      cancelReservationMutation.mutate(id);
    }
  };

  const handleInputChange = (field: keyof NewReservationFormState, value: string | number) => {
    setNewReservation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sort reservations by date and time
  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.timeSlot);
    const dateB = new Date(b.timeSlot);
    return dateA.getTime() - dateB.getTime();
  });
  
  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-[#8A2633]">
              <Lock className="h-5 w-5" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#8A2633] hover:bg-[#722127]"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-[#F5F2EA] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#8A2633] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-[#333333]">Manage restaurant reservations</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#8A2633] text-[#8A2633] hover:bg-[#8A2633] hover:text-white"
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="view">View Reservations</TabsTrigger>
            <TabsTrigger value="add">Add Reservation</TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  All Reservations ({reservations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading reservations...</div>
                ) : sortedReservations.length === 0 ? (
                  <div className="text-center py-8 text-[#666666]">
                    No reservations found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedReservations.map((reservation) => (
                      <div
                        key={reservation.reservationId}
                        className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#8A2633]">
                              {reservation.name}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-[#666666]">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {formatDate(reservation.timeSlot)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(reservation.timeSlot).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {reservation.guests} guest{reservation.guests !== 1 ? 's' : ''}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {reservation.email}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-[#666666]">
                              {reservation.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {reservation.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">Table {reservation.tableNumber}</Badge>
                              </div>
                            </div>
                            {reservation.specialRequests && (
                              <div className="mt-2">
                                <Badge variant="outline" className="mb-1">Special Requests</Badge>
                                <p className="text-sm text-[#666666] italic">
                                  {reservation.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.reservationId, reservation.name || "(unknown)")}
                            disabled={cancelReservationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Reservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateReservation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Customer Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={newReservation.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="Enter customer name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newReservation.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="customer@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newReservation.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        placeholder="(202) 555-0123"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={newReservation.guests}
                        onChange={(e) => handleInputChange("guests", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newReservation.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newReservation.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      value={newReservation.specialRequests || ""}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="Any dietary restrictions, special occasions, etc."
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={createReservationMutation.isPending}
                    className="w-full bg-[#8A2633] hover:bg-[#722127]"
                  >
                    {createReservationMutation.isPending ? "Creating..." : "Create Reservation"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
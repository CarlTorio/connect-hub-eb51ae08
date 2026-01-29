import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, User, Mail, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  updated_at: string;
}

const BookingHistory = ({ open, onOpenChange }: BookingHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  // Fetch completed/cancelled/no-show bookings
  const fetchBookingHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .in('status', ['completed', 'cancelled', 'no-show'])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setBookingHistory(data || []);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Failed to load booking history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBookingHistory();
    }
  }, [open]);

  // Filter bookings
  const filteredBookings = bookingHistory.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const bookingDate = new Date(booking.preferred_date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      if (filterDate === 'week') matchesDate = bookingDate >= weekAgo;
      else if (filterDate === 'month') matchesDate = bookingDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats
  const completedBookings = bookingHistory.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookingHistory.filter(b => b.status === 'cancelled').length;
  const noShowBookings = bookingHistory.filter(b => b.status === 'no-show').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      case 'no-show': return 'bg-amber-500/20 text-amber-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Mobile card view for bookings
  const MobileBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="border-border/50 mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{booking.name}</p>
              <Badge className={`${getStatusColor(booking.status)} mt-1`}>
                {booking.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{booking.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{booking.contact_number}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{booking.preferred_date} at {booking.preferred_time}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            asChild
          >
            <a href={`tel:${booking.contact_number.replace(/-/g, '')}`}>
              <Phone className="h-4 w-4" />
              Call Client
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] w-full p-4' : 'max-w-6xl'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`font-display ${isMobile ? 'text-xl' : 'text-2xl'}`}>Booking History</DialogTitle>
          <p className="text-muted-foreground text-sm">View past bookings</p>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4">
          <Card className="border-border/50">
            <CardContent className={`${isMobile ? 'p-2' : 'p-4'} text-center`}>
              <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-700`}>{completedBookings}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className={`${isMobile ? 'p-2' : 'p-4'} text-center`}>
              <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-destructive`}>{cancelledBookings}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className={`${isMobile ? 'p-2' : 'p-4'} text-center`}>
              <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-amber-700`}>{noShowBookings}</p>
              <p className="text-xs text-muted-foreground">No Show</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50 mt-4">
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-2`}>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className={isMobile ? 'w-full' : 'w-[180px]'}>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className={isMobile ? 'w-full' : 'w-[180px]'}>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size={isMobile ? "default" : "icon"} 
                  onClick={fetchBookingHistory} 
                  disabled={isLoading}
                  className={isMobile ? 'w-full gap-2' : ''}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isMobile && 'Refresh'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings - Mobile Cards or Desktop Table */}
        {isMobile ? (
          <div className="mt-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <MobileBookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium text-sm">No booking history</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isLoading ? 'Loading...' : 'Bookings will appear here'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-border/50 mt-4">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Appointment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{booking.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {booking.email}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {booking.contact_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{booking.preferred_date}</p>
                              <p className="text-xs text-muted-foreground">{booking.preferred_time}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            asChild
                          >
                            <a href={`tel:${booking.contact_number.replace(/-/g, '')}`}>
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="p-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">No booking history found</p>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : 'Bookings will appear here when marked as completed, cancelled, or no-show'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-3 mt-4`}>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export History
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingHistory;

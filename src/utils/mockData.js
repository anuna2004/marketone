export const customerStats = {
  upcomingBookings: 2,
  lastBooking: {
    service: 'House Cleaning',
    date: '2024-03-15',
    status: 'Confirmed',
  },
};

export const providerStats = {
  servicesListed: 3,
  activeBookings: 2,
  totalEarnings: 450,
};

export const serviceCategories = [
  'Home Services',
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Tutoring',
  'Gardening',
];

export const services = [
  {
    id: 1,
    title: 'House Cleaning',
    provider: 'CleanPro Services',
    providerBio: 'Professional cleaning service with 5+ years of experience. We specialize in residential and commercial cleaning.',
    rating: 4.8,
    price: 50,
    category: 'Cleaning',
    description: 'Comprehensive house cleaning service including dusting, vacuuming, mopping, and bathroom cleaning. Perfect for regular maintenance or special occasions.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    reviews: [
      {
        id: 1,
        user: 'Sarah Johnson',
        rating: 5,
        comment: 'Excellent service! Very thorough and professional.',
        date: '2024-03-10',
      },
      {
        id: 2,
        user: 'Mike Brown',
        rating: 4,
        comment: 'Good cleaning service, would recommend.',
        date: '2024-03-05',
      },
    ],
    availability: [
      { date: '2024-03-20', slots: ['09:00', '11:00', '14:00', '16:00'] },
      { date: '2024-03-21', slots: ['10:00', '13:00', '15:00', '17:00'] },
    ],
  },
  {
    id: 2,
    title: 'Plumbing Repair',
    provider: 'QuickFix Plumbing',
    providerBio: 'Licensed plumbers available 24/7 for emergency repairs and regular maintenance.',
    rating: 4.5,
    price: 75,
    category: 'Plumbing',
    description: 'Professional plumbing services including leak repairs, pipe installation, and emergency plumbing issues.',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    reviews: [
      {
        id: 1,
        user: 'John Smith',
        rating: 5,
        comment: 'Fast response and fixed the issue quickly!',
        date: '2024-03-12',
      },
    ],
    availability: [
      { date: '2024-03-20', slots: ['08:00', '10:00', '13:00', '15:00'] },
      { date: '2024-03-21', slots: ['09:00', '11:00', '14:00', '16:00'] },
    ],
  },
  {
    id: 3,
    title: 'Electrical Work',
    provider: 'SafeElect Solutions',
    providerBio: 'Certified electricians specializing in residential and commercial electrical work.',
    rating: 4.9,
    price: 65,
    category: 'Electrical',
    description: 'Complete electrical services including installations, repairs, and safety inspections.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    reviews: [
      {
        id: 1,
        user: 'Emily Davis',
        rating: 5,
        comment: 'Very professional and knowledgeable!',
        date: '2024-03-08',
      },
    ],
    availability: [
      { date: '2024-03-20', slots: ['09:00', '11:00', '14:00', '16:00'] },
      { date: '2024-03-21', slots: ['10:00', '13:00', '15:00', '17:00'] },
    ],
  },
];

export const bookings = [
  {
    id: 1,
    service: 'House Cleaning',
    date: '2024-03-15',
    time: '14:00',
    status: 'Completed',
    provider: 'CleanPro Services',
    address: '123 Main St, City',
    instructions: 'Please bring cleaning supplies',
  },
  {
    id: 2,
    service: 'Plumbing Repair',
    date: '2024-03-20',
    time: '10:00',
    status: 'Pending',
    provider: 'QuickFix Plumbing',
    address: '123 Main St, City',
    instructions: 'Leaking pipe in bathroom',
  },
];

export const providerServices = [
  {
    id: 1,
    title: 'House Cleaning',
    price: 50,
    category: 'Home Services',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Deep Cleaning',
    price: 80,
    category: 'Home Services',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Office Cleaning',
    price: 100,
    category: 'Commercial',
    status: 'Inactive',
  },
];

export const providerBookings = [
  {
    id: 1,
    customer: 'John Doe',
    service: 'House Cleaning',
    date: '2024-03-15',
    status: 'Confirmed',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    service: 'Deep Cleaning',
    date: '2024-03-20',
    status: 'Pending',
  },
]; 
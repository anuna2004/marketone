const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join provider room
    socket.on('joinProvider', (providerId) => {
      socket.join(`provider-${providerId}`);
    });

    // Join customer room
    socket.on('joinCustomer', (customerId) => {
      socket.join(`customer-${customerId}`);
    });

    // Handle new booking
    socket.on('newBooking', (booking) => {
      io.to(`provider-${booking.providerId}`).emit('bookingReceived', booking);
    });

    // Handle booking status update
    socket.on('bookingStatusUpdate', (booking) => {
      io.to(`customer-${booking.customerId}`).emit('bookingUpdated', booking);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
}; 
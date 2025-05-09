const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metrics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    cancelledBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    activeProviders: {
      type: Number,
      default: 0
    },
    activeCustomers: {
      type: Number,
      default: 0
    },
    newRegistrations: {
      providers: {
        type: Number,
        default: 0
      },
      customers: {
        type: Number,
        default: 0
      }
    }
  },
  serviceMetrics: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    bookings: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Index for efficient date-based queries
analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 
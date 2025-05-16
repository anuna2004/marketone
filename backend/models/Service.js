const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 15
  },
  images: [{
    type: String,
    url: String
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: [{
      start: String,
      end: String
    }]
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  // New fields for ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  searchKeywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
serviceSchema.index({ location: '2dsphere' });

// Index for text search
serviceSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  tags: 'text',
  searchKeywords: 'text'
});

// Pre-save middleware to update search keywords
serviceSchema.pre('save', function(next) {
  this.searchKeywords = [
    ...new Set([
      ...this.name.toLowerCase().split(' '),
      ...this.description.toLowerCase().split(' '),
      ...this.category.toLowerCase().split(' '),
      ...this.tags.map(tag => tag.toLowerCase()),
      ...this.searchKeywords
    ])
  ];
  next();
});

module.exports = mongoose.model('Service', serviceSchema); 
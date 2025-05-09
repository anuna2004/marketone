const Analytics = require('../models/Analytics');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Generate daily analytics
const generateDailyAnalytics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get bookings for today
    const bookings = await Booking.find({
      createdAt: { $gte: today }
    }).populate('serviceId');

    // Calculate metrics
    const metrics = {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.serviceId.price : 0), 0)
    };

    // Calculate service-specific metrics
    const serviceMetrics = [];
    const services = await Service.find();
    
    for (const service of services) {
      const serviceBookings = bookings.filter(b => b.serviceId._id.toString() === service._id.toString());
      serviceMetrics.push({
        serviceId: service._id,
        bookings: serviceBookings.length,
        revenue: serviceBookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.serviceId.price : 0), 0)
      });
    }

    // Create or update analytics record
    await Analytics.findOneAndUpdate(
      { date: today },
      { metrics, serviceMetrics },
      { upsert: true, new: true }
    );

    return { metrics, serviceMetrics };
  } catch (error) {
    throw new Error(`Error generating analytics: ${error.message}`);
  }
};

// Get analytics for a date range
const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Analytics.find(query)
      .populate('serviceMetrics.serviceId')
      .sort({ date: -1 });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's analytics
    const todayAnalytics = await Analytics.findOne({ date: today });

    // Get last 7 days analytics
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weeklyAnalytics = await Analytics.find({
      date: { $gte: lastWeek, $lte: today }
    }).sort({ date: 1 });

    // Calculate trends
    const trends = {
      bookings: calculateTrend(weeklyAnalytics, 'metrics.totalBookings'),
      revenue: calculateTrend(weeklyAnalytics, 'metrics.totalRevenue')
    };

    // Get top performing services
    const topServices = await Service.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'serviceId',
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          bookings: { $size: '$bookings' },
          revenue: {
            $reduce: {
              input: '$bookings',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  { $cond: [{ $eq: ['$$this.status', 'completed'] }, '$$this.price', 0] }
                ]
              }
            }
          }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      today: todayAnalytics,
      trends,
      topServices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate trends
const calculateTrend = (data, metricPath) => {
  if (!data || data.length < 2) return 0;
  
  const values = data.map(d => {
    const path = metricPath.split('.');
    return path.reduce((obj, key) => obj[key], d);
  });

  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  
  if (firstValue === 0) return 100;
  return ((lastValue - firstValue) / firstValue) * 100;
};

module.exports = {
  generateDailyAnalytics,
  getAnalytics,
  getDashboardSummary
}; 
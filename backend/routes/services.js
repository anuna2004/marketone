const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const upload = require('../middleware/upload');
const { getIO } = require('../utils/socket');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service with image upload
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    
    const service = new Service({
      providerId: req.body.providerId, // Ensure providerId is included
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      duration: req.body.duration,
      location: {
        type: 'Point',
        coordinates: req.body.location?.coordinates || [0, 0],
        address: req.body.location?.address
      },
      images: imageUrls,
      availability: Array.isArray(req.body.availability) ? req.body.availability : []
    });

    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update service with image upload
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : service.images;
    
    Object.assign(service, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      duration: req.body.duration,
      location: {
        type: 'Point',
        coordinates: req.body.location?.coordinates || service.location.coordinates,
        address: req.body.location?.address || service.location.address
      },
      images: imageUrls,
      availability: Array.isArray(req.body.availability) ? req.body.availability : service.availability
    });

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
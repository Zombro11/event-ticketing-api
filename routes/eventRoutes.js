const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminDashboard,
} = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const eventValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('seatCapacity')
    .isInt({ min: 1 })
    .withMessage('Seat capacity must be greater than 0'),
  body('bookedSeats')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Booked seats cannot be negative'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must not be negative'),
];

const updateEventValidationRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('seatCapacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Seat capacity must be greater than 0'),
  body('bookedSeats')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Booked seats cannot be negative'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must not be negative'),
];

router.get('/', getEvents);
router.get('/dashboard/admin', protect, adminOnly, getAdminDashboard);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, eventValidationRules, validateRequest, createEvent);
router.put('/:id', protect, adminOnly, updateEventValidationRules, validateRequest, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;

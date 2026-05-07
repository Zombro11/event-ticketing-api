const express = require('express');
const { body } = require('express-validator');
const {
  getUserBookings,
  getUserBookingById,
  createBooking,
  validateBookingQRCode,
} = require('../controllers/bookingController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', protect, getUserBookings);
router.get('/validate/:qr', protect, adminOnly, validateBookingQRCode);
router.get('/:id', protect, getUserBookingById);

router.post(
  '/',
  protect,
  [
    body('event').isMongoId().withMessage('Valid event ID is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be greater than 0'),
  ],
  validateRequest,
  createBooking
);

module.exports = router;

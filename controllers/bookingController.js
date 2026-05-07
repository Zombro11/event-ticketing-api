const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Event = require('../models/Event');

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title category venue date time price')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getUserBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'event',
      'title category venue date time price'
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. This booking does not belong to you.' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { event: eventId, quantity } = req.body;
    const requestedQuantity = Number(quantity);

    const event = await Event.findById(eventId).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Event not found' });
    }

    const availableSeats = event.seatCapacity - event.bookedSeats;

    if (requestedQuantity > availableSeats) {
      await session.abortTransaction();
      return res.status(400).json({
        error: `Only ${availableSeats} seat(s) available for this event`,
      });
    }

    event.bookedSeats += requestedQuantity;
    await event.save({ session });

    const bookingPayload = {
      user: req.user._id,
      event: event._id,
      quantity: requestedQuantity,
    };

    const bookingArray = await Booking.create([bookingPayload], { session });
    const booking = bookingArray[0];

    const qrData = JSON.stringify({
      bookingId: booking._id,
      userId: req.user._id,
      eventId: event._id,
      eventTitle: event.title,
      quantity: requestedQuantity,
    });

    booking.qrCode = await QRCode.toDataURL(qrData);
    await booking.save({ session });

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking._id).populate(
      'event',
      'title category venue date time price'
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const validateBookingQRCode = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ qrCode: req.params.qr })
      .populate('user', 'name email')
      .populate('event', 'title venue date time');

    if (!booking) {
      return res.status(404).json({ error: 'Invalid ticket QR code' });
    }

    res.json({
      message: 'Ticket is valid',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookings,
  getUserBookingById,
  createBooking,
  validateBookingQRCode,
};

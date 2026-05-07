const Event = require('../models/Event');
const Booking = require('../models/Booking');

const getEvents = async (req, res, next) => {
  try {
    const { category, date } = req.query;
    const filter = {};

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
      }

      filter.date = { $gte: start, $lt: end };
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.body._id) {
      delete req.body._id;
    }

    if (
      req.body.seatCapacity !== undefined &&
      Number(req.body.seatCapacity) < event.bookedSeats
    ) {
      return res.status(400).json({
        error: 'Seat capacity cannot be lower than the number of already booked seats',
      });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const bookingCount = await Booking.countDocuments({ event: event._id });

    if (bookingCount > 0) {
      return res.status(400).json({
        error: 'This event cannot be deleted because it already has bookings',
      });
    }

    await event.deleteOne();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getAdminDashboard = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const dashboard = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id })
          .populate('user', 'name email')
          .select('user quantity bookingDate');

        return {
          event,
          bookings,
        };
      })
    );

    res.json(dashboard);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminDashboard,
};

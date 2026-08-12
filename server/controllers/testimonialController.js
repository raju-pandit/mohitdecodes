import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ featured: -1, createdAt: -1 });
    res.status(200).json({ success: true, message: 'Testimonials fetched', data: testimonials });
  } catch (err) { next(err); }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, message: 'Testimonial submitted for review', data: testimonial });
  } catch (err) { next(err); }
};

export const approveTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    testimonial.approved = !testimonial.approved;
    await testimonial.save();
    res.status(200).json({ success: true, message: testimonial.approved ? 'Testimonial approved' : 'Testimonial hidden', data: testimonial });
  } catch (err) { next(err); }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
};

export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials, total: testimonials.length });
  } catch (err) { next(err); }
};

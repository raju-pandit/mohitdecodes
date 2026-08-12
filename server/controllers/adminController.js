import User from '../models/User.js';
import Course from '../models/Course.js';
import Blog from '../models/Blog.js';
import Tutorial from '../models/Tutorial.js';
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';
import Roadmap from '../models/Roadmap.js';
import Testimonial from '../models/Testimonial.js';
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';

// @desc   Get admin stats
// @route  GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalCourses, totalBlogs, totalTutorials, totalResources,
      totalProjects, totalRoadmaps, newsletterSubscribers, totalContacts, newMessages
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isPublished: true }),
      Blog.countDocuments({ published: true }),
      Tutorial.countDocuments({ published: true }),
      Resource.countDocuments({ isPublished: true }),
      Project.countDocuments(),
      Roadmap.countDocuments({ isPublished: true }),
      Newsletter.countDocuments({ subscribed: true }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' })
    ]);

    // Total downloads
    const downloadAgg = await Resource.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]);
    const totalDownloads = downloadAgg[0]?.total || 0;

    // Total students enrolled
    const studentsAgg = await Course.aggregate([{ $group: { _id: null, total: { $sum: '$students' } } }]);
    const totalStudents = studentsAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      message: 'Stats fetched',
      data: {
        totalUsers, totalCourses, totalBlogs, totalTutorials, totalResources,
        totalProjects, totalRoadmaps, newsletterSubscribers, totalContacts,
        newMessages, totalDownloads, totalStudents
      }
    });
  } catch (err) { next(err); }
};

// @desc   Get all users (admin)
// @route  GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
        .select('-password -resetPasswordToken -resetPasswordExpire'),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true, data: users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) { next(err); }
};

// @desc   Update user role (admin)
// @route  PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (err) { next(err); }
};

// @desc   Delete user (admin)
// @route  DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

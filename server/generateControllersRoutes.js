const fs = require('fs');
const path = require('path');

const baseDir = 'd:\\Mohitwesite\\mohitdecodes\\server';

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.join(baseDir, 'controllers'));
ensureDir(path.join(baseDir, 'routes'));

const controllers = {
    'authController.js': `const User = require('../models/User');
const crypto = require('crypto');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        sendTokenResponse(user, 201, res);
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    res.status(200).json({ success: true, data: {} });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('enrolledCourses savedBlogs');
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        res.status(200).json({ success: true, data: resetToken });
    } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid token' });
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (err) { next(err); }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: true };
    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};
`,
    'courseController.js': `const Course = require('../models/Course');
const User = require('../models/User');

exports.getCourses = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\\b(gt|gte|lt|lte|in)\\b/g, match => \`$\${match}\`);
        
        let filter = JSON.parse(queryStr);
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        if (!req.user || req.user.role !== 'admin') {
            filter.isPublished = true;
        }

        query = Course.find(filter);

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        query = query.skip(startIndex).limit(limit);

        const courses = await query;
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (err) { next(err); }
};

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate('instructor');
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
    try {
        // Slug auto-generated in pre-save hook
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: course });
    } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

exports.enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        
        const user = await User.findById(req.user.id);
        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json({ success: false, error: 'Already enrolled' });
        }
        user.enrolledCourses.push(course._id);
        await user.save();
        
        course.students += 1;
        await course.save();

        res.status(200).json({ success: true, data: course });
    } catch (err) { next(err); }
};
`,
    'tutorialController.js': `const Tutorial = require('../models/Tutorial');

exports.getTutorials = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        let filter = {};
        if (req.query.search) {
            filter = { title: { $regex: req.query.search, $options: 'i' } };
        }
        const tutorials = await Tutorial.find(filter).skip((page - 1) * limit).limit(limit);
        res.status(200).json({ success: true, data: tutorials });
    } catch (err) { next(err); }
};

exports.getTutorial = async (req, res, next) => {
    try {
        const tutorial = await Tutorial.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!tutorial) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: tutorial });
    } catch (err) { next(err); }
};

exports.createTutorial = async (req, res, next) => {
    try {
        const tutorial = await Tutorial.create(req.body);
        res.status(201).json({ success: true, data: tutorial });
    } catch (err) { next(err); }
};

exports.updateTutorial = async (req, res, next) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: tutorial });
    } catch (err) { next(err); }
};

exports.deleteTutorial = async (req, res, next) => {
    try {
        await Tutorial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
`,
    'blogController.js': `const Blog = require('../models/Blog');
const User = require('../models/User');

exports.getBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        let filter = {};
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        const blogs = await Blog.find(filter).skip((page - 1) * limit).limit(limit).populate('author');
        res.status(200).json({ success: true, data: blogs });
    } catch (err) { next(err); }
};

exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author comments.user');
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.createBlog = async (req, res, next) => {
    try {
        req.body.author = req.user.id;
        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.deleteBlog = async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        blog.comments.push({ user: req.user.id, text: req.body.text });
        await blog.save();
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.toggleSaveBlog = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const index = user.savedBlogs.indexOf(req.params.id);
        if (index > -1) {
            user.savedBlogs.splice(index, 1);
        } else {
            user.savedBlogs.push(req.params.id);
        }
        await user.save();
        res.status(200).json({ success: true, data: user.savedBlogs });
    } catch (err) { next(err); }
};
`,
    'resourceController.js': `const Resource = require('../models/Resource');

exports.getResources = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        let filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.type) filter.type = req.query.type;
        if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
        
        const resources = await Resource.find(filter).skip((page - 1) * limit).limit(limit);
        res.status(200).json({ success: true, data: resources });
    } catch (err) { next(err); }
};

exports.getResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);
        res.status(200).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

exports.createResource = async (req, res, next) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

exports.updateResource = async (req, res, next) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

exports.deleteResource = async (req, res, next) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

exports.downloadResource = async (req, res, next) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
        if (!resource) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: { fileUrl: resource.fileUrl } });
    } catch (err) { next(err); }
};
`,
    'projectController.js': `const Project = require('../models/Project');

exports.getProjects = async (req, res, next) => {
    try {
        let filter = {};
        if (req.query.technology) filter.technologies = req.query.technology;
        if (req.query.difficulty) filter.difficulty = req.query.difficulty;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
        
        const projects = await Project.find(filter);
        res.status(200).json({ success: true, data: projects });
    } catch (err) { next(err); }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        res.status(200).json({ success: true, data: project });
    } catch (err) { next(err); }
};

exports.createProject = async (req, res, next) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) { next(err); }
};

exports.updateProject = async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: project });
    } catch (err) { next(err); }
};

exports.deleteProject = async (req, res, next) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
`,
    'roadmapController.js': `const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

exports.getRoadmaps = async (req, res, next) => {
    try {
        const roadmaps = await Roadmap.find();
        res.status(200).json({ success: true, data: roadmaps });
    } catch (err) { next(err); }
};

exports.getRoadmap = async (req, res, next) => {
    try {
        const roadmap = await Roadmap.findOne({ slug: req.params.slug });
        res.status(200).json({ success: true, data: roadmap });
    } catch (err) { next(err); }
};

exports.createRoadmap = async (req, res, next) => {
    try {
        const roadmap = await Roadmap.create(req.body);
        res.status(201).json({ success: true, data: roadmap });
    } catch (err) { next(err); }
};

exports.updateRoadmap = async (req, res, next) => {
    try {
        const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: roadmap });
    } catch (err) { next(err); }
};

exports.deleteRoadmap = async (req, res, next) => {
    try {
        await Roadmap.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

exports.updateProgress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const { stepId, completed } = req.body;
        
        const existingProgress = user.roadmapProgress.find(r => r.roadmap.toString() === req.params.id);
        if (existingProgress) {
            if (completed && !existingProgress.completedSteps.includes(stepId)) {
                existingProgress.completedSteps.push(stepId);
            } else if (!completed) {
                existingProgress.completedSteps = existingProgress.completedSteps.filter(id => id !== stepId);
            }
        } else if (completed) {
            user.roadmapProgress.push({ roadmap: req.params.id, completedSteps: [stepId] });
        }
        
        await user.save();
        res.status(200).json({ success: true, data: user.roadmapProgress });
    } catch (err) { next(err); }
};
`,
    'testimonialController.js': `const Testimonial = require('../models/Testimonial');

exports.getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial.find({ approved: true });
        res.status(200).json({ success: true, data: testimonials });
    } catch (err) { next(err); }
};

exports.createTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    } catch (err) { next(err); }
};

exports.approveTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.status(200).json({ success: true, data: testimonial });
    } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
`,
    'newsletterController.js': `const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res, next) => {
    try {
        const { email } = req.body;
        const exists = await Newsletter.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Already subscribed' });
        
        await Newsletter.create({ email });
        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (err) { next(err); }
};
`,
    'contactController.js': `const Contact = require('../models/Contact');

exports.createContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, data: contact });
    } catch (err) { next(err); }
};

exports.getContacts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        let filter = {};
        if (req.query.status) filter.status = req.query.status;
        
        const contacts = await Contact.find(filter).skip((page - 1) * limit).limit(limit);
        res.status(200).json({ success: true, data: contacts });
    } catch (err) { next(err); }
};

exports.updateContactStatus = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.status(200).json({ success: true, data: contact });
    } catch (err) { next(err); }
};
`,
    'searchController.js': `const Course = require('../models/Course');
const Tutorial = require('../models/Tutorial');
const Blog = require('../models/Blog');
const Resource = require('../models/Resource');
const Project = require('../models/Project');
const Roadmap = require('../models/Roadmap');

exports.globalSearch = async (req, res, next) => {
    try {
        const q = req.query.q;
        if (!q) return res.status(200).json({ success: true, data: {} });
        
        const regex = new RegExp(q, 'i');
        const [courses, tutorials, blogs, resources, projects, roadmaps] = await Promise.all([
            Course.find({ $or: [{ title: regex }, { tags: regex }] }),
            Tutorial.find({ title: regex }),
            Blog.find({ title: regex }),
            Resource.find({ title: regex }),
            Project.find({ title: regex }),
            Roadmap.find({ title: regex })
        ]);
        
        res.status(200).json({
            success: true,
            data: { courses, tutorials, blogs, resources, projects, roadmaps }
        });
    } catch (err) { next(err); }
};
`,
    'adminController.js': `const User = require('../models/User');
const Course = require('../models/Course');
const Blog = require('../models/Blog');
const Resource = require('../models/Resource');
const Newsletter = require('../models/Newsletter');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Tutorial = require('../models/Tutorial');

exports.getStats = async (req, res, next) => {
    try {
        const [totalUsers, totalCourses, totalBlogs, totalResources, totalProjects, totalTutorials, newsletterSubscribers, contactMessages] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Blog.countDocuments(),
            Resource.countDocuments(),
            Project.countDocuments(),
            Tutorial.countDocuments(),
            Newsletter.countDocuments(),
            Contact.countDocuments()
        ]);
        
        const resources = await Resource.find();
        const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0);

        res.status(200).json({
            success: true,
            data: { totalUsers, totalCourses, totalBlogs, totalResources, totalDownloads, newsletterSubscribers, contactMessages, totalProjects, totalTutorials }
        });
    } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) { next(err); }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};
`
};

const routes = {
    'auth.js': `const express = require('express');
const { register, login, logout, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
`,
    'courses.js': `const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, enrollCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:slug').get(getCourse);

router.route('/:id')
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;
`,
    'tutorials.js': `const express = require('express');
const { getTutorials, getTutorial, createTutorial, updateTutorial, deleteTutorial } = require('../controllers/tutorialController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getTutorials)
    .post(protect, authorize('admin'), createTutorial);

router.route('/:slug').get(getTutorial);

router.route('/:id')
    .put(protect, authorize('admin'), updateTutorial)
    .delete(protect, authorize('admin'), deleteTutorial);

module.exports = router;
`,
    'blogs.js': `const express = require('express');
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, addComment, toggleSaveBlog } = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getBlogs)
    .post(protect, authorize('admin'), createBlog);

router.route('/:slug').get(getBlog);

router.route('/:id')
    .put(protect, authorize('admin'), updateBlog)
    .delete(protect, authorize('admin'), deleteBlog);

router.post('/:id/comment', protect, addComment);
router.post('/:id/save', protect, toggleSaveBlog);

module.exports = router;
`,
    'resources.js': `const express = require('express');
const { getResources, getResource, createResource, updateResource, deleteResource, downloadResource } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getResources)
    .post(protect, authorize('admin'), createResource);

router.route('/:id')
    .get(getResource)
    .put(protect, authorize('admin'), updateResource)
    .delete(protect, authorize('admin'), deleteResource);

router.post('/:id/download', downloadResource);

module.exports = router;
`,
    'projects.js': `const express = require('express');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getProjects)
    .post(protect, authorize('admin'), createProject);

router.route('/:slug').get(getProject);

router.route('/:id')
    .put(protect, authorize('admin'), updateProject)
    .delete(protect, authorize('admin'), deleteProject);

module.exports = router;
`,
    'roadmaps.js': `const express = require('express');
const { getRoadmaps, getRoadmap, createRoadmap, updateRoadmap, deleteRoadmap, updateProgress } = require('../controllers/roadmapController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getRoadmaps)
    .post(protect, authorize('admin'), createRoadmap);

router.route('/:slug').get(getRoadmap);

router.route('/:id')
    .put(protect, authorize('admin'), updateRoadmap)
    .delete(protect, authorize('admin'), deleteRoadmap);

router.put('/:id/progress', protect, updateProgress);

module.exports = router;
`,
    'testimonials.js': `const express = require('express');
const { getTestimonials, createTestimonial, approveTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .get(getTestimonials)
    .post(createTestimonial);

router.route('/:id/approve')
    .put(protect, authorize('admin'), approveTestimonial);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteTestimonial);

module.exports = router;
`,
    'newsletter.js': `const express = require('express');
const { subscribe } = require('../controllers/newsletterController');
const router = express.Router();

router.post('/subscribe', subscribe);

module.exports = router;
`,
    'contact.js': `const express = require('express');
const { createContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
    .post(createContact)
    .get(protect, authorize('admin'), getContacts);

router.route('/:id')
    .put(protect, authorize('admin'), updateContactStatus);

module.exports = router;
`,
    'search.js': `const express = require('express');
const { globalSearch } = require('../controllers/searchController');
const router = express.Router();

router.get('/', globalSearch);

module.exports = router;
`,
    'admin.js': `const express = require('express');
const { getStats, getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.route('/users')
    .get(getAllUsers);
router.route('/users/:id')
    .put(updateUserRole)
    .delete(deleteUser);
router.route('/users/:id/role').put(updateUserRole);

module.exports = router;
`
};

for (const [file, content] of Object.entries(controllers)) {
    fs.writeFileSync(path.join(baseDir, 'controllers', file), content);
}

for (const [file, content] of Object.entries(routes)) {
    fs.writeFileSync(path.join(baseDir, 'routes', file), content);
}

console.log('Successfully generated all controllers and routes');

const Blog = require('../models/Blog');
const User = require('../models/User');

exports.getBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        let filter = {};
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        if (req.query.category) {
            filter.category = req.query.category;
        }
        // Users see only published blogs, unless they are admin
        if (!req.user || req.user.role !== 'admin') {
            filter.published = true;
        }
        
        const blogs = await Blog.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort('-createdAt');
            
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (err) { next(err); }
};

exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.createBlog = async (req, res, next) => {
    try {
        const authorInfo = {
            name: req.user.name,
            avatar: req.user.avatar,
            bio: 'Instructor/Author'
        };
        const blogData = { ...req.body, author: authorInfo };
        const blog = await Blog.create(blogData);
        res.status(201).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
        
        const comment = {
            name: req.body.name || req.user?.name || 'Anonymous',
            email: req.body.email || req.user?.email || 'anonymous@example.com',
            message: req.body.message || req.body.text || '',
            approved: true // Auto approve comments for this demo/edu environment
        };
        
        blog.comments.push(comment);
        await blog.save();
        res.status(200).json({ success: true, data: blog });
    } catch (err) { next(err); }
};

exports.toggleSaveBlog = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const index = user.savedBlogs.findIndex(
            (b) => b.toString() === req.params.id.toString()
        );
        if (index > -1) {
            user.savedBlogs.splice(index, 1);
        } else {
            user.savedBlogs.push(req.params.id);
        }
        await user.save();
        res.status(200).json({ success: true, data: user.savedBlogs });
    } catch (err) { next(err); }
};

exports.getAdminBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find().sort('-createdAt');
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (err) { next(err); }
};

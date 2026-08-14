import Course from '../models/Course.js';
import User from '../models/User.js';
import slugify from 'slugify';

export const getCourses = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
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
        const coursesWithCounts = await Promise.all(
            courses.map(async (c) => {
                const liveCount = await User.countDocuments({ 'enrolledCourses.courseId': c._id });
                const cObj = c.toObject();
                cObj.students = Math.max(cObj.students || 0, liveCount);
                cObj.studentsCount = cObj.students;
                return cObj;
            })
        );
        res.status(200).json({ success: true, count: coursesWithCounts.length, data: coursesWithCounts });
    } catch (err) { next(err); }
};

export const getCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        const liveCount = await User.countDocuments({ 'enrolledCourses.courseId': course._id });
        const courseObj = course.toObject();
        courseObj.students = Math.max(courseObj.students || 0, liveCount);
        courseObj.studentsCount = courseObj.students;
        res.status(200).json({ success: true, data: courseObj });
    } catch (err) { next(err); }
};

export const createCourse = async (req, res, next) => {
    try {
        if (!req.body.slug && req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (err) { next(err); }
};

export const updateCourse = async (req, res, next) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, strict: true });
        }
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: course });
    } catch (err) { next(err); }
};

export const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

export const enrollCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        
        const user = await User.findById(req.user.id);
        
        const alreadyEnrolled = user.enrolledCourses.some(
            (item) => item.courseId.toString() === course._id.toString()
        );
        if (alreadyEnrolled) {
            return res.status(400).json({ success: false, error: 'Already enrolled in this course' });
        }
        
        user.enrolledCourses.push({ courseId: course._id });
        await user.save();
        
        course.students = (course.students || 0) + 1;
        await course.save();

        const liveCount = await User.countDocuments({ 'enrolledCourses.courseId': course._id });
        const courseObj = course.toObject();
        courseObj.students = Math.max(courseObj.students || 0, liveCount);
        courseObj.studentsCount = courseObj.students;

        res.status(200).json({ success: true, data: courseObj });
    } catch (err) { next(err); }
};

export const getAdminCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().lean();
        const coursesWithCounts = await Promise.all(
            courses.map(async (c) => {
                const liveCount = await User.countDocuments({ 'enrolledCourses.courseId': c._id });
                const count = Math.max(c.students || 0, liveCount);
                return {
                    ...c,
                    students: count,
                    studentsCount: count
                };
            })
        );
        res.status(200).json({ success: true, count: coursesWithCounts.length, data: coursesWithCounts });
    } catch (err) { next(err); }
};


export const toggleLessonComplete = async (req, res, next) => {
    try {
        const { courseId, moduleIndex, lessonIndex } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, error: 'Please provide courseId, moduleIndex, and lessonIndex' });
        }
        
        const user = await User.findById(req.user.id);
        const lessonKey = `${courseId}-${moduleIndex}-${lessonIndex}`;
        
        const index = user.completedLessons.indexOf(lessonKey);
        if (index > -1) {
            user.completedLessons.splice(index, 1);
        } else {
            user.completedLessons.push(lessonKey);
        }
        
        await user.save();
        res.status(200).json({ success: true, data: { user } });
    } catch (err) { next(err); }
};

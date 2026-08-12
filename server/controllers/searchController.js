import Course from '../models/Course.js';
import Tutorial from '../models/Tutorial.js';
import Blog from '../models/Blog.js';
import Resource from '../models/Resource.js';
import Project from '../models/Project.js';
import Roadmap from '../models/Roadmap.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
    }

    const searchRegex = { $regex: q, $options: 'i' };

    const [courses, tutorials, blogs, resources, projects, roadmaps] = await Promise.all([
      Course.find({ isPublished: true, $or: [{ title: searchRegex }, { description: searchRegex }, { tags: searchRegex }] })
        .limit(5).select('title slug thumbnail category difficulty'),
      Tutorial.find({ published: true, $or: [{ title: searchRegex }, { excerpt: searchRegex }] })
        .limit(5).select('title slug category difficulty readingTime'),
      Blog.find({ published: true, $or: [{ title: searchRegex }, { excerpt: searchRegex }, { tags: searchRegex }] })
        .limit(5).select('title slug coverImage category readingTime'),
      Resource.find({ isPublished: true, $or: [{ title: searchRegex }, { description: searchRegex }] })
        .limit(5).select('title description category fileType'),
      Project.find({ $or: [{ title: searchRegex }, { description: searchRegex }, { technologies: searchRegex }] })
        .limit(5).select('title slug image technologies difficulty'),
      Roadmap.find({ isPublished: true, $or: [{ title: searchRegex }, { description: searchRegex }] })
        .limit(5).select('title slug description category difficulty')
    ]);

    const total = courses.length + tutorials.length + blogs.length + resources.length + projects.length + roadmaps.length;

    res.status(200).json({
      success: true,
      message: `Found ${total} results for "${q}"`,
      data: { courses, tutorials, blogs, resources, projects, roadmaps },
      total
    });
  } catch (err) { next(err); }
};

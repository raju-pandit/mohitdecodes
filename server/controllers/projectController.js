import Project from '../models/Project.js';

export const getProjects = async (req, res, next) => {
  try {
    const { technology, difficulty, category, search, page = 1, limit = 12 } = req.query;
    const query = {};
    if (technology) query.technologies = technology;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query)
    ]);

    res.status(200).json({
      success: true, message: 'Projects fetched', data: projects,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), limit: parseInt(limit) }
    });
  } catch (err) { next(err); }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, message: 'Project fetched', data: project });
  } catch (err) { next(err); }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (err) { next(err); }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, message: 'Project updated', data: project });
  } catch (err) { next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

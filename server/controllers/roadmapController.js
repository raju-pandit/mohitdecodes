import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';

export const getRoadmaps = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$text = { $search: search };

    const roadmaps = await Roadmap.find(query).sort({ featured: -1, createdAt: -1 });
    res.status(200).json({ success: true, message: 'Roadmaps fetched', data: roadmaps });
  } catch (err) { next(err); }
};

export const getAdminRoadmaps = async (req, res, next) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Admin roadmaps fetched', data: roadmaps });
  } catch (err) { next(err); }
};

export const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug, isPublished: true });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

    let userProgress = [];
    if (req.user) {
      const user = await User.findById(req.user.id);
      const progress = user.roadmapProgress.find(p => p.roadmapId.toString() === roadmap._id.toString());
      if (progress) userProgress = progress.completedSteps;
    }

    res.status(200).json({ success: true, message: 'Roadmap fetched', data: roadmap, userProgress });
  } catch (err) { next(err); }
};

export const createRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.create(req.body);
    res.status(201).json({ success: true, message: 'Roadmap created', data: roadmap });
  } catch (err) { next(err); }
};

export const updateRoadmap = async (req, res, next) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    res.status(200).json({ success: true, message: 'Roadmap updated', data: roadmap });
  } catch (err) { next(err); }
};

export const deleteRoadmap = async (req, res, next) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Roadmap deleted' });
  } catch (err) { next(err); }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { stepId, completed } = req.body;
    const roadmapId = req.params.id;
    const user = await User.findById(req.user.id);

    let progress = user.roadmapProgress.find(p => p.roadmapId.toString() === roadmapId);
    if (!progress) {
      user.roadmapProgress.push({ roadmapId, completedSteps: [] });
      progress = user.roadmapProgress[user.roadmapProgress.length - 1];
    }

    if (completed) {
      if (!progress.completedSteps.includes(stepId)) progress.completedSteps.push(stepId);
    } else {
      progress.completedSteps = progress.completedSteps.filter(s => s !== stepId);
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Progress updated', completedSteps: progress.completedSteps });
  } catch (err) { next(err); }
};

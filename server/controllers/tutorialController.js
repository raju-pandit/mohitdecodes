const Tutorial = require('../models/Tutorial');

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

exports.getAdminTutorials = async (req, res, next) => {
    try {
        const tutorials = await Tutorial.find();
        res.status(200).json({ success: true, count: tutorials.length, data: tutorials });
    } catch (err) { next(err); }
};

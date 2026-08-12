import Resource from '../models/Resource.js';

export const getResources = async (req, res, next) => {
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

export const getResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);
        res.status(200).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

export const createResource = async (req, res, next) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

export const updateResource = async (req, res, next) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: resource });
    } catch (err) { next(err); }
};

export const deleteResource = async (req, res, next) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err) { next(err); }
};

export const downloadResource = async (req, res, next) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
        if (!resource) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: { fileUrl: resource.fileUrl } });
    } catch (err) { next(err); }
};

export const getAdminResources = async (req, res, next) => {
    try {
        const resources = await Resource.find();
        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (err) { next(err); }
};

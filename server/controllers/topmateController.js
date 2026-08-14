import TopmateCard from '../models/TopmateCard.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const DEFAULT_TOPMATE_URL = 'https://topmate.io/mohitdecodes';

// Seed default Topmate card if database is empty
const seedDefaultIfEmpty = async () => {
  const count = await TopmateCard.countDocuments();
  if (count === 0) {
    await TopmateCard.create({
      badge: 'TOPMATE',
      title: 'Developer Roadmap & Career Guidance',
      description: 'Book a 1:1 mentorship session and get personalized guidance for your developer career.',
      buttonText: 'Book on Topmate',
      url: DEFAULT_TOPMATE_URL,
      imageUrl: '/logo.png',
      status: 'active',
      displayOrder: 0
    });
  }
};

/**
 * @desc    Get all Topmate cards (Public active cards or Admin all)
 * @route   GET /api/topmate
 * @access  Public
 */
export const getTopmateCards = async (req, res, next) => {
  try {
    await seedDefaultIfEmpty();

    const query = {};
    // If not an admin asking for all cards, filter by status === 'active'
    if (req.query.all !== 'true' || req.user?.role !== 'admin') {
      query.status = 'active';
    }

    const cards = await TopmateCard.find(query).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single Topmate card
 * @route   GET /api/topmate/:id
 * @access  Public
 */
export const getTopmateCard = async (req, res, next) => {
  try {
    const card = await TopmateCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Topmate card not found'
      });
    }

    res.status(200).json({
      success: true,
      data: card
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new Topmate card
 * @route   POST /api/topmate
 * @access  Private/Admin
 */
export const createTopmateCard = async (req, res, next) => {
  try {
    const {
      title,
      description,
      badge,
      buttonText,
      url,
      status,
      displayOrder,
      imageUrl,
      cloudinaryPublicId
    } = req.body;

    const newCard = await TopmateCard.create({
      title,
      description,
      badge: badge || 'TOPMATE',
      buttonText: buttonText || 'Book on Topmate',
      url: url || DEFAULT_TOPMATE_URL,
      status: status || 'active',
      displayOrder: Number(displayOrder) || 0,
      imageUrl: imageUrl || '/logo.png',
      cloudinaryPublicId: cloudinaryPublicId || ''
    });

    res.status(201).json({
      success: true,
      message: 'Topmate promotional card created successfully',
      data: newCard
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Topmate card
 * @route   PUT /api/topmate/:id
 * @access  Private/Admin
 */
export const updateTopmateCard = async (req, res, next) => {
  try {
    let card = await TopmateCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Topmate card not found'
      });
    }

    // Delete old Cloudinary image if replaced
    if (req.body.imageUrl && req.body.imageUrl !== card.imageUrl && card.cloudinaryPublicId) {
      await deleteFromCloudinary(card.cloudinaryPublicId);
    }

    if (req.body.url === '') {
      req.body.url = DEFAULT_TOPMATE_URL;
    }

    card = await TopmateCard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Topmate card updated successfully',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Topmate card
 * @route   DELETE /api/topmate/:id
 * @access  Private/Admin
 */
export const deleteTopmateCard = async (req, res, next) => {
  try {
    const card = await TopmateCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Topmate card not found'
      });
    }

    // Delete from Cloudinary if stored there
    if (card.cloudinaryPublicId) {
      await deleteFromCloudinary(card.cloudinaryPublicId);
    }

    await TopmateCard.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Topmate card deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Topmate card active/inactive status
 * @route   PATCH /api/topmate/:id/status
 * @access  Private/Admin
 */
export const toggleTopmateStatus = async (req, res, next) => {
  try {
    const card = await TopmateCard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Topmate card not found'
      });
    }

    card.status = card.status === 'active' ? 'inactive' : 'active';
    await card.save();

    res.status(200).json({
      success: true,
      message: `Card is now ${card.status}`,
      data: card
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload image to Cloudinary (or local fallback)
 * @route   POST /api/topmate/upload
 * @access  Private/Admin
 */
export const uploadTopmateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path, 'mohitdecodes/topmate');

    res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      data: {
        imageUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id
      }
    });
  } catch (error) {
    next(error);
  }
};

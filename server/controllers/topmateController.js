import TopmateCard from '../models/TopmateCard.js';

const DEFAULT_TOPMATE_URL = 'https://topmate.io/mohitdecodes';

// Seed helper if empty
const seedDefaultIfEmpty = async () => {
  const count = await TopmateCard.countDocuments();
  if (count === 0) {
    await TopmateCard.create({
      category: 'TOPMATE',
      title: 'Connect with Mohit',
      description: 'Book a 1:1 mentorship call, portfolio & resume review, custom career guidance, or mock technical interview.',
      badge: '1:1 Session Available',
      buttonText: 'Book on Topmate',
      url: DEFAULT_TOPMATE_URL,
      status: 'active',
      displayOrder: 0,
      image: '/logo.png'
    });
  }
};

/**
 * @desc    Get Topmate cards (Public active only or Admin all)
 * @route   GET /api/topmate
 * @access  Public (admin can pass ?all=true)
 */
export const getTopmateCards = async (req, res, next) => {
  try {
    await seedDefaultIfEmpty();

    const query = {};
    // If not admin asking for all, only return active cards
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
      category,
      url,
      status,
      displayOrder,
      image
    } = req.body;

    const newCard = await TopmateCard.create({
      title,
      description,
      badge: badge || 'Available',
      buttonText: buttonText || 'Book on Topmate',
      category: category || 'TOPMATE',
      url: url || DEFAULT_TOPMATE_URL,
      status: status || 'active',
      displayOrder: Number(displayOrder) || 0,
      image: image || ''
    });

    res.status(201).json({
      success: true,
      message: 'Topmate card created successfully',
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

    // Default url fallback if empty
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
 * @desc    Toggle Topmate card status (active / inactive)
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
      message: `Card status changed to ${card.status}`,
      data: card
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload image for Topmate card
 * @route   POST /api/topmate/upload
 * @access  Private/Admin
 */
export const uploadTopmateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Format relative URL
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    next(error);
  }
};

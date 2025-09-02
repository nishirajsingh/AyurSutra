const Therapy = require('../models/Therapy');

exports.getTherapies = async (req, res, next) => {
  try {
    const therapies = await Therapy.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: therapies.length,
      data: {
        therapies
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTherapy = async (req, res, next) => {
  try {
    const therapy = await Therapy.findById(req.params.id);

    if (!therapy) {
      return res.status(404).json({
        success: false,
        message: 'Therapy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        therapy
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createTherapy = async (req, res, next) => {
  try {
    const therapy = await Therapy.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        therapy
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTherapy = async (req, res, next) => {
  try {
    const therapy = await Therapy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!therapy) {
      return res.status(404).json({
        success: false,
        message: 'Therapy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        therapy
      }
    });
  } catch (error) {
    next(error);
  }
};
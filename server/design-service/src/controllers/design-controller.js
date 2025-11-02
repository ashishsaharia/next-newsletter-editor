const Design = require("../models/design");

// Get all designs for a user
exports.getUserDesigns = async (req, res) => {
  try {
    const userId = req.user.userId;

    const designs = await Design.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: designs,
    });
  } catch (err) {
    console.error("Error fetching designs for the user:", err);
    res.status(500).json({
      success: false,
      message: "Can't get designs for the user",
    });
  }
};

// Get a single design by its ID
exports.getUserDesignByID = async (req, res) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;

    const design = await Design.findOne({ _id: designId, userId });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found or you don't have permission to view it",
      });
    }

    res.status(200).json({
      success: true,
      data: design,
    });
  } catch (err) {
    console.error("Error fetching design by ID:", err);
    res.status(500).json({
      success: false,
      message: "Can't get design by ID",
    });
  }
};

// Save or update a design
exports.saveDesign = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { designId, name, canvasData, width, height } = req.body;

    if (designId) {
      // Update existing design
      const design = await Design.findOne({ _id: designId, userId });
      if (!design) {
        return res.status(404).json({
          success: false,
          message: "Design not found or you don't have permission to edit it",
        });
      }

      if (name) design.name = name;
      if (canvasData) design.canvasData = canvasData;
      if (width) design.width = width;
      if (height) design.height = height;

      design.updatedAt = Date.now();
      const updatedDesign = await design.save();

      return res.status(200).json({
        success: true,
        data: updatedDesign,
      });
    } else {
      // Create new design
      const newDesign = new Design({
        userId,
        name: name || "Untitled Design",
        width,
        height,
        canvasData,
      });

      const savedDesign = await newDesign.save();

      return res.status(200).json({
        success: true,
        data: savedDesign,
      });
    }
  } catch (err) {
    console.error("Error saving design:", err);
    res.status(500).json({
      success: false,
      message: "Can't save design",
    });
  }
};

// Delete a design
exports.deleteDesign = async (req, res) => {
  try {
    const userId = req.user.userId;
    const designId = req.params.id;

    const design = await Design.findOne({ _id: designId, userId });

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found or you don't have permission to delete it",
      });
    }

    await Design.deleteOne({ _id: designId });

    res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting design:", err);
    res.status(500).json({
      success: false,
      message: "Can't delete design",
    });
  }
};

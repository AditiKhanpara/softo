const PackageTable = require("../models/PackageTable");

// format response based on type
function formatByType(entry) {
  const data = entry.toJSON();

  if (data.type === "squareNet") {
    return {
      id: data.id,
      name: data.name,
      item: data.item,
      nos: data.nos,
      width: data.width,
      length: data.length,
      square_feet: data.square_feet,
      rs: data.rs,
      total: data.total,
      type: data.type,
    };
  } else if (data.type === "description") {
    return {
      id: data.id,
      carpentryWork: data.carpentryWork,
      description: data.description,
      size: data.size,
      price: data.price,
      type: data.type,
    };
  }

  return data;
}

// ✅ Get current user's form
const getMyForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const form = await PackageTable.findOne({ where: { createdBy: userId } });

    if (!form) {
      return res.status(404).json({ error: "No form found for this user" });
    }

    res.status(200).json(formatByType(form));
  } catch (err) {
    console.error("Get My Form Error:", err);
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

// ✅ Create form for user (first time)
const createMyForm = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    // Optional: prevent multiple records per user
    const exists = await PackageTable.findOne({ where: { createdBy: userId } });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Form already exists for this user" });
    }

    const form = await PackageTable.create({
      type,
      createdBy: userId,
    });

    res.status(201).json(formatByType(form));
  } catch (err) {
    console.error("Create My Form Error:", err);
    res.status(500).json({ error: "Failed to create form" });
  }
};

// ✅ Update only the type field
const updateMyFormType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const form = await PackageTable.findOne({ where: { createdBy: userId } });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    form.type = type;
    await form.save();

    res.status(200).json(formatByType(form));
  } catch (err) {
    console.error("Update Type Error:", err);
    res.status(500).json({ error: "Failed to update form type" });
  }
};

const deleteMyForm = async (req, res) => {
  try {
    const userId = req.user.id;

    const form = await PackageTable.findOne({ where: { createdBy: userId } });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    await form.destroy();

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error("Delete Form Error:", err);
    res.status(500).json({ error: "Failed to delete form" });
  }
};

module.exports = {
  getMyForm,
  createMyForm,
  updateMyFormType,
  deleteMyForm,
};

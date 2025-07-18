exports.getUserProfile = async (req, res) => {
  try {
    res.status(200).json({ user: "User profile data here" });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

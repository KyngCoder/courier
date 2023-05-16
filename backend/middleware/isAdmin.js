const { Users } = require("../models");

const isAdmin = async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      // Find the user with the provided userId
      const user = await Users.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  console.log(user.isAdmin)
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  };
  
  module.exports = isAdmin;
  
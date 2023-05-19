const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { Users, Login } = require("../models");

const generateUniqueNumber = require("../util/generateUniqueNumber");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    telephone,
    city,
    parish,
    address,
    pickup_location,
    userName,
    email,
    password,
  } = req.body;

  try {
    console.log("about to");
    // Generate a unique member number
    const memberNumber = await generateUniqueNumber();
    console.log(memberNumber);
    // Check if the member number already exists
    const memberExists = await Users.findOne({
      where: { member_no: memberNumber },
    });
    if (memberExists) {
      return res.status(400).json({ message: "Member number already exists" });
    }

    // Check if the username already exists
    const usernameExists = await Login.findOne({ where: { userName } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if the email already exists
    const emailExists = await Users.findOne({ where: { email } });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Create a new Login record 
    const login = await Login.create({
      userName: userName,
      password: hashedPassword,
    });

    // Create a new User record and associate it with the Login record
    const user = await Users.create({
      firstName,
      lastName,
      telephone,
      email,
      city,
      parish,
      address,
      pickup_location,
      isAdmin: false,
      member_no: memberNumber,
    });
    console.log("user", user);

    // Associate the User record with the Login record
    await login.setUser(user);

    // Generate a JWT token
    const token = jwt.sign({ userId: user.member_no }, "secret", {
      expiresIn: "24h",
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while registering" });
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;


  try {
    // Find the login record with the given username and include the associated User record
    const login = await Login.findOne({
      where: { userName },
      include: { model: Users },
    });

    if (!login) {
      return res.status(404).json({ message: "Login not found" });
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, login.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Get the user information from the Users model using the userId field in the Login model
    const user = await Users.findOne({
      where: { id: login.userId },
    });

    // Return the user data along with the login token
    const token = sign({ id: login.id }, "secret", {
      expiresIn: "20h",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while logging in" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    return res.json({ msg: "no users" });
  }
};



const updateProfile = async (req, res) => {
  const { firstName, lastName, password, oldPassword } = req.body;
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await Users.findByPk(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(userId)
    console.log(user.id)
    // Find the login record for the user
    const login = await Login.findOne({
      where: { userId: req.params.userId },
    });

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, login.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Update the user's first name and last name
    user.firstName = firstName;
    user.lastName = lastName;

    
  
      const hashedPassword = await bcrypt.hash(password, 10);
      login.password = hashedPassword;
    

    // Save the updated user and login
    await user.save();
    await login.save();

    res.status(200).json({ message: "User profile updated successfully", user, login });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};




module.exports = { registerUser, loginUser, getAllUsers, updateProfile };

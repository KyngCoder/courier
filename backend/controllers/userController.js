const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { Users, Login } = require("../models");

const generateUniqueNumber = require("../util/generateUniqueNumber");

const jwt = require('jsonwebtoken');

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
    // Generate a unique member number
    const memberNumber = await generateUniqueNumber();

    // Check if the member number already exists
    const memberExists = await Users.findOne({ where: { member_no: memberNumber } });
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

    // Create a new Login record and set its username to the user's telephone number
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

    // Associate the User record with the Login record
    await login.setUser(user);

    // Generate a JWT token
    const token = jwt.sign({ userId: user.member_no }, 'secret', { expiresIn: '24h' });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while registering" });
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
    return res.status(500).json({ message: "An error occurred while logging in" });
  }
};


module.exports = { registerUser, loginUser };

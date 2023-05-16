const express = require("express");
const bcrypt = require("bcrypt");
const { jwt, sign } = require("jsonwebtoken");

const { Users, Login } = require("../models");

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
  
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Create a new User record and associate it with a new Login record
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
      });
  
      // Create a new Login record and set its username to the user's telephone number
      const login = await Login.create({
        userName: userName,
        password: hashedPassword,
      });
  
      // Associate the Login record with the User record
      await user.setLogin(login);
  
      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while registering" });
    }
  }


const loginUser =  async (req, res) => {
    const { userName, password } = req.body;
  
    try {
      // Find the login record with the given username
      const login = await Login.findOne({ where: { userName } });
  
      if (!login) {
        return res.status(404).json({ message: "Login not found" });
      }
  
      // Verify the password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, login.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Find the associated user record
      const user = await Users.findOne({ where: { LoginId: login.id } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log(login.id)
  
      // Return the user data along with the login token
      const token = sign({ id: login.id }, "secret", {
        expiresIn: "1h",
      });
  
      return res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred while logging in" });
    }
  }

  module.exports = {registerUser, loginUser}
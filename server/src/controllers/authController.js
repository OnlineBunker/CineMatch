// signup and login logic

import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// signup function for website
const signup = async (req, res) => {
  try {
    // 3 input fields in the frontend
    const { name, email, password } = req.body;

    // if any field is missing then error
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // checking wether email is already in the database or not
    const existingUser = await prisma.user.findUnique({ where: { email } }); 
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // adding the info in the prisma database
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // creating a token for further verification 
    // a jwt token consists of three things: { header, signature, tail }
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    // only 2 parameters in login body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // finding the email to confirm if in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // checking the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // same token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // changing the lastlogin datetime to the new one
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login };

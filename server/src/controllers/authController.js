import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {name, email, password: hashedPassword,},
    });

    const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: "30d",});

    res.status(201).json({ message: "User created successfully", token, userId: newUser.id });

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "30d",});

    await prisma.user.update({
      where: {id: user.id},
      data: { lastLogin: new Date() }
    });

    res.status(200).json({ message: "Login successful", token, userId: user.id });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signup, login };
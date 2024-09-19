import bcrypt from 'bcryptjs'
import faculty from '../models/faculty/signup.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
  const { id, email, name, password } = req.body;

  try {
    if (!id || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: `${!name ? "Name" : !id ? "Id" : !email ? "Email" : "Password"} is required`,
      });
    }

    const existingFaculty = await faculty.findOne({ email });

    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: "Id or Email already registered",
      })
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newFaculty = new faculty({
      facultyName: name,
      facultyId: id,
      facultyEmail: email,
      facultyPassword: hashPassword,
    })

    await newFaculty.save();

    return res.status(200).json({
      success: true,
      message: "Faculty registered Succesfully",
    })

  } catch (error) {
    console.log("Error in Sign up Faculty", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: `${!email ? "Email" : "Password"} is required`,
    });
  }

  const isExistingFaculty = await faculty.findOne({ facultyEmail: email })
  if (!isExistingFaculty) {
    return res.status(400).json({ success: false, message: 'Email not registered' })
  }

  const hashPassword = isExistingFaculty?.facultyPassword;
  const isCorrectPassword = bcrypt.compareSync(password, hashPassword);

  if (!isCorrectPassword) {
    return res.status(400).json({
      success: false,
      message: 'Password is invalid',
    });
  }

  const facultyToken = jwt.sign({ id: isExistingFaculty._id, role: isExistingFaculty.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie("facultyToken", facultyToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || false,
    sameSite: 'None'
  });
  res.setHeader('Set-Cookie', `facultyToken=${facultyToken}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`);
  res.status(201).json({ success: true, message: 'Login successful' });
}

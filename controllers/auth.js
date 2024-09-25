import bcrypt from 'bcryptjs'
import faculty from '../models/faculty/signup.js';
import jwt from 'jsonwebtoken';
import sendVerificationEmail from '../utils/sendEmail.js';

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

    const savedUser = await newFaculty.save();

    // Send verification email with link
    await sendVerificationEmail(email, savedUser._id);

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

  if (!isExistingFaculty?.isVerified) {
    return res.status(400).json({ success: false, message: 'Please verify your email before logging in.' });
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

export async function logout(req, res) {
  res.cookie("facultyToken", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || false,
    sameSite: 'None'
  });

  res.setHeader('Set-Cookie', `facultyToken=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Expires=${new Date(Date.now()).toUTCString()}`);

  res.status(201).json({ success: true, message: 'Logout successful' });
}

export async function check_auth(req, res) {

  const token = req?.cookies?.facultyToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      name: '',
      message: 'invalid token'
    })
  }


  const facultyToken = jwt.verify(token, process.env.JWT_SECRET)
  const { facultyName } = await faculty.findOne({ _id: facultyToken?.id })

  res.status(201).json({ success: true, name: facultyName, message: 'Login successful' });
}


export const verifyEmailById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await faculty.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'User is already verified' });
    }

    // Update the user's isVerified status
    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

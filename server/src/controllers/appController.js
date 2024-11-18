const UserModel = require('../models/User.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const otpStore = new Map(); // Store OTPs temporarily

/** Register Function */
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      confirmPass,
      email,
      role = "student",
      profile = "",
      picturePath = "",
      friends = [],
      githubLink = "",
    } = req.body;

    // Validate email based on role
    if (role === 'student' && !/^[a-zA-Z0-9._%+-]+@szabist\.pk$/.test(email)) {
      return res.status(400).send({ error: "Students must use an email ending with @szabist.pk" });
    }
    if (role === 'alumni' && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).send({ error: "Invalid email format for alumni" });
    }

    // Check if username or email exists
    const existUsername = await UserModel.findOne({ username }).exec();
    const existEmail = await UserModel.findOne({ email }).exec();

    if (existUsername) return res.status(400).send({ error: "Username already taken" });
    if (existEmail) return res.status(400).send({ error: "Email already registered" });
    if (password !== confirmPass) return res.status(400).send({ error: "Passwords do not match" });

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
      role,
      profile,
      picturePath,
      friends,
      githubLink,
    });

    await user.save();

    // Generate OTP and send email after registration
    const otp = otpGenerator.generate(6, { digits: true });
    otpStore.set(email, { otp, expiresAt: Date.now() + 60000 }); // 1-minute expiry

    await sendOtpEmail(email, otp);

    res.status(201).send({ msg: "User registered successfully, OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Unable to register user" });
  }
};

/** Send OTP Email */
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'ak1096561@gmail.com', // Replace with your email
      pass: 'emhrwhhatllhjegv', // Replace with your email password or app password
    },
  });

  const mailOptions = {
    from: 'ak1096561@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It expires in 1 minute.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP to ${email}:`, error);
    throw new Error('Failed to send OTP');
  }
}

/** Verify OTP */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStore.get(email);
  if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
    return res.status(400).send({ error: 'Invalid or expired OTP' });
  }

  // Remove OTP from the store after successful verification
  otpStore.delete(email);
  res.status(200).send({ message: 'OTP verified successfully' });
};

/** Login Function */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ username }).exec();
    if (!user) return res.status(400).send({ error: 'Incorrect username' });

    // Validate password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).send({ error: 'Incorrect password' });

    res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Unable to login' });
  }
};

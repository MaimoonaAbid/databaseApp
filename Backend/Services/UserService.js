// UserService.js

const User = require('../Models/User'); // Update the import path
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

class UserService {
  constructor() {}

  async createUser({ name, email, password, role, spaceneeded}) {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
      otp: otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false }),
      'db-created': false,
      'db_name': null,
      'verified': false,
      spaceneeded, 
    });

    return user;
  }

  async sendEmailWithOTP(user) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service (e.g., Gmail)
      auth: {
        user: 'maimoonaabid2000@gmail.com', // Replace with your email address
        pass: 'btcr atmg pzzc eroj', // Replace with your email password
      },
      tls: {
        rejectUnauthorized: false, // Add this line to disable TLS verification
      },
      debug: true, // Enable debugging
    });

    const mailOptions = {
      from: 'maimoonaabid2000@gmail.com',
      to: user.email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${user.otp}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyOTP(email, otp) {
    const user = await User.findOne({ where: { email } });

    if (user.otp !== otp) {
      throw new Error('Incorrect OTP');
    }
    
    user.otp = null;
    user.verified = true;
    await user.save();
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
  
}

module.exports = UserService;
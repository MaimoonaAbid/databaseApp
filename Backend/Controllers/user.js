let corsoption = {
    origin: "http://localhost:3000", //origin from where you requesting
    credentials: true,
  };

  const nodemailer = require('nodemailer');
  const otpGenerator = require('otp-generator');
  const User = require('../Models/User'); // Update the import path
  const createAdminDatabase = require('../controllers/database').createAdminDatabase;
  const pgp = require('pg-promise')();
  const connection = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  };

  
exports.register = async (req, res) => {
  try {
    // Extracting user data from the request body
    const { name, email, password, role } = req.body;

    // Checking if the email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.send({status: 'failed', error: 'A user with this email already exists'})
    }
else{ 
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
console.log(otp)

    // Creating a transporter object using nodemailer
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
console.log(transporter)
    // Defining email data
    const mailOptions = {
      from: 'maimoonaabid2000@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${otp}`,
    };

    // Sending the email with OTP
   await transporter.sendMail(mailOptions);

    // Creating a new user with OTP data
    const user = await User.create({
      name,
      email,
      password,
      role,
      otp: otp, // Save OTP in the user record
      'db-created': false,
      'db_name': null,
      'verified': false,
    });
   console.log(user)
     
    // User added successfully message response
    res.status(200).json({ message: 'New user added successfully in the database' });}
    // Generating a 6-digit OTP
   
  } catch (error) {
    console.error('Registration Error:', error);
    res.send({ error: 'Registration Failed' });
  }
};

//Endpoint to verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "The user with this email doesn't exist" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Incorrect OTP' });
    }

    // Clear OTP after successful verification
    user.otp = null;
    //make verifield column status true
    user.verified= true;
    await user.save();
    // Create a new database for admin users
    if (user.role === 'admin') {
      const uniqueDbName = await createAdminDatabase(user);
      user.db_name = uniqueDbName; // Assuming 'db_name' is the correct field name
      await user.save();
    }
    // Verification successful message response
    res.status(200).json({ success: true, message: 'OTP verification successful', user });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'OTP Verification Failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking whether email exists or not
    const userExists = await User.findOne({ where: { email } });

    if (!userExists || userExists.password !== password  ) {
      //return res.status(401).json({ error: 'No user with this email exists' });
      res.send({status: 'failed', error: 'User email or password is wrong'})
    }
     console.log("after successful login")
    const { role, db_name } = userExists;
     console.log("after successfull login", role, db_name)
    if (role === 'admin' && db_name) {
      // User is an admin and has a database assigned
      const adminDbName = db_name;

      try {
        // Set up the database connection using adminDbName
        const adminDb = pgp({ ...connection, database: adminDbName });

        // Send a response indicating a successful login and the connected database name
        res.status(200).json({ message: 'Account logged in successfully', userExists, connectedDb: adminDbName });

        // Don't forget to release the database connection when done
        adminDb.$pool.end();
      } catch (dbError) {
        console.error('Database Connection Error:', dbError);
        res.status(500).json({ error: 'Database Connection Failed' });
      }
    } else {
      // Handle non-admin user login
      res.status(200).json({ message: 'Account logged in successfully', userExists}); 
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(401).json({ error: 'Login Failed' });
  }
};

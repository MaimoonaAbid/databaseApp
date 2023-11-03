let corsoption = {
  origin: "http://localhost:3000", //origin from where you requesting
  credentials: true,
};

const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Update the import path
const UserService = require('../Services/UserService'); // New import
const pgp = require('pg-promise')();
const createAdminDatabase = require('../Controllers/database').createAdminDatabase;
const connection = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
  
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, 'maimoona123', { expiresIn: '1h' }); // Adjust the expiration time as needed
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role} = req.body;
    console.log(name,email,password,role)
    // Inject the UserService dependency
    const userService = new UserService();

   // Create a new user
    const user = await userService.createUser({ name, email, password, role});

    // Send an email with OTP
    await userService.sendEmailWithOTP(user);
    // User added successfully message response
    const token = generateToken(user);
    res.status(200).json({ message: 'New user added successfully in the database' , token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.send({ status: 'failed', error: 'A user with this email already exists' })
    res.send({ error: 'Registration Failed' });
  }
};

//Endpoint to verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
      console.log(email, otp)
    // Inject the UserService dependency
    const userService = new UserService();

    // Verify OTP
    const user = await userService.verifyOTP(email, otp);
    console.log(user)
    // Create a new database for admin users
    if (user.role === 'admin') {
      //const spaceneeded = user.spaceneeded;
      const uniqueDbName = await createAdminDatabase(user);
      user.db_name = uniqueDbName; // Assuming 'db_name' is the correct field name
      await user.save();
    }
    // Verification successful message response
    const token = generateToken(user);
     res.status(200).json({ success: true, message: 'OTP verification successful', user , token})
   
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'OTP Verification Failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Inject the UserService dependency
    const userService = new UserService();

    // Login the user
    const userExists = await userService.login(email, password);

    // User logged in successfully message response
    console.log("user returned from login function",userExists);
    if (userExists.role === 'admin' && userExists.db_name) {
      // User is an admin and has a database assigned
      const adminDbName = userExists.db_name;

      try {
        // Set up the database connection using adminDbName
        const adminDb = pgp({ ...connection, database: adminDbName });

        const token = generateToken(userExists);
        console.log(token)
        // Send a response indicating a successful login and the connected database name
        res.status(200).json({ message: 'Account logged in successfully', userExists, token, connectedDb: adminDbName });

        // Don't forget to release the database connection when done
        adminDb.$pool.end();
      } catch (dbError) {
        console.error('Database Connection Error:', dbError);
        res.status(500).json({ error: 'Database Connection Failed' });
      }
    } else {
      const token = generateToken(userExists);
      // Handle non-admin user login
      res.status(200).json({ message: 'Account logged in successfully', token, userExists });
    }
  } catch (error) {
    console.error('Login Error:', error); 
    res.send({ status: 'failed', error: 'User email or password is wrong' })
    //res.status(401).json({ error: 'Login Failed' });
  }
};
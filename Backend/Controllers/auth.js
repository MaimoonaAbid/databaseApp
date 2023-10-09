// // const User = require('../Models/User')
// // exports.login = async (req, res) =>
// // {
// //     try {
// //         //extracting user credentials from teh request body
// //         const { email, password} = req.body;
// //         //checking if the user exists in the database
// //         const userExists = await User.findOne({email})
// //         if(!userExists){
// //            return res.status(401).json({error:"No user with this email exists"})
// //         }
// //         if(userExists.password !== password)
// //         {
// //             return res.status(401).json({error:"Password is incorrect"})
// //         }
// //         const role = userExists.role;
        
// //         res.status(200).json({role})
// //     }
// //     catch(error){
// //         console.error(error)
// //         res.status(500).json({error:'Login failed due to an error'})
// //     }

// // }
// const User = require('../Models/User'); // Update the import path

// exports.login = async (req, res) => {
//   try {
//     // Extracting user credentials from the request body
//     const { email, password } = req.body;

//     // Checking if the user exists in the database
//     const userExists = await User.findOne({ where: { email } });

//     if (!userExists) {
//       return res.status(401).json({ error: "No user with this email exists" });
//     }

//     if (userExists.password !== password) {
//       return res.status(401).json({ error: "Password is incorrect" });
//     }

//     const role = userExists.role;

//     res.status(200).json({ role });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Login failed due to an error' });
//   }
// };


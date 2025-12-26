// // import mongoose from 'mongoose'
// import User from './src/models/User.js'
// import connectDB from "./src/config/db.js";
// import bcrypt from "bcrypt";
// import 'dotenv/config'

// const registerAdmin = async()=>{
//     await connectDB();
//     const Admin = {
//         name: 'manthan gajbhiye',
//         phone : '1231231231',
//         email: "manthan@gmail.com",
//         password: "helloworld",
//         role : 'admin'

//     }
//     const hashedPassword = await bcrypt.hash(Admin["password"], 10);
//     const user = await User.create({
//      name: 'manthan gajbhiye',
//         phone : '1231231231',
//         email: "manthan@gmail.com",
//         password: hashedPassword,
//         role : 'admin'
//     });
// }
// registerAdmin();
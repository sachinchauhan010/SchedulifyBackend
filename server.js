// Conntect DB
// App.listen


import dotenv from 'dotenv';

import app from "./app.js";
import connectDB from './configure/db.js';

dotenv.config();

connectDB();

app.listen(process.env.PORT, ()=>{
  console.log(`App is running on PORT number, ${process.env.PORT}`);
});







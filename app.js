import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import { ROLES } from './enum/role.js';
import authoriseRoute from './middlewares/authorise.js';
import faculty_route from './routes/faculty.js'
import auth_route from './routes/auth.js'

const app = express();

const corsOptions = {
  credentials: true,
  origin: ['https://trackmyclass.vercel.app', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: true,
  optionsSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/api/auth',  auth_route);
app.use('/api/faculty', authoriseRoute(ROLES.FACULTY), faculty_route);

app.get('/', (req, res) => {
  res.send("Backend is up and running")
})

export default app;

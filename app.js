import express, { urlencoded } from 'express';
import faculty from './routes/faculty.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

const corsOptions = {
  credentials: true,
  origin: 'https://trackmyclass.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: true,
  optionsSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/api/faculty', faculty);

app.get('/', (req, res) => {
  res.send("Backend Chal rha h")
})

export default app;

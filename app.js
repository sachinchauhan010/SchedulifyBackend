import express, { urlencoded } from 'express';
import faculty from './routes/faculty.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

var corsOptions = {
  origin: ['https://trackmyclass.vercel.app', 'http://localhost:5173'],
  optionsSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/faculty', faculty);

app.get('/', (req, res) => {
  res.send("Backend Chal rha h")
})

export default app;

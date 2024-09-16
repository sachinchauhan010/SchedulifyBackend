import express, { urlencoded } from 'express';
import faculty from './routes/faculty.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/faculty', faculty);

app.get('/', (req, res) => {
  res.send("Backend Chal rha h")
})


export default app;

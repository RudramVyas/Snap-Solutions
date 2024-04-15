import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

require('dotenv').config();

// csrf protection
const csrfProtection = csrf({ cookie: true });

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Create express application
const app = express();
const helmetOptions = {
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
};
// Connect to the database
mongoose.connect(process.env.DATABASE).then(() => console.log('**Db connect**')).catch((err) => console.log('db error => ', err));

// Apply middlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(express.json());
app.use(morgan('dev'));

// Route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

// CSRF
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Port
const port = 8000;

app.listen(port, () => console.log('server is running on 8000'));

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const Boot = require('./boot');
const connectDB = require('./db');
const {
  adminAuth,
  userAuth,
} = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());

app.disable('x-powered-by');

app.use('/api/user', require('./routes/user'));
app.use('/api/pokemon', require('./routes/pokemon'));
app.use('/api/type', require('./routes/type'));
app.use('/api/favorites', require('./routes/favorites'));

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

app.get('/admin', adminAuth, (_req, res) => res.send('Admin Route'));
app.get('/basic', userAuth, (_req, res) => res.send('User Route'));
app.get('/', (_req, res) => res.send('Pokemon App Waldo Vázquez'));

const server = app.listen(process.env.PORT || 3500, () => console.info(`Server Connected to port ${process.env.PORT || 3500}`));

process.on('unhandledRejection', (err) => {
  console.info(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

connectDB();
Boot();

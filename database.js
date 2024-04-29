const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 8000;
const database = require('C:/Users/ASUS/database');

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 's_series'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check username and password against the database
  connection.query('SELECT * FROM users WHERE userid = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('An unexpected error occurred');
    }

    if (results.length === 0 || results[0].password !== password) {
      console.log('Login failed. Userid or password is incorrect.');
      return res.status(401).send('Login failed');
    }

    console.log('Login successful');
    res.send('Login successful');
  });
});

// Serve the sign-up page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Handle sign-up form submission
app.post('/register', (req, res) => {
  const { name, password, confirm_password, email } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).send('<script>alert("Password does not match"); window.location="/signup.html";</script>');
  }

  // Insert user data into the database
  const userData = { name, password, confirm_password, email };
  connection.query('INSERT INTO users SET ?', userData, (err, results) => {
    if (err) {
      console.error('Error inserting data into users table: ' + err.stack);
      return res.status(500).send('Error signing up');
    }
    console.log('Data inserted into users table successfully.');
    res.status(200).send('Signed up successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

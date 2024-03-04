const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Kết nối đến MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejslearning',
  connectionLimit: 5
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Sử dụng EJS làm view engine
app.set('view engine', 'ejs');

// Sử dụng bodyParser để xử lý dữ liệu POST
app.use(bodyParser.urlencoded({ extended: true }));

// Hiển thị danh sách người dùng
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    res.render('index', { users: result });
  });
});

// Hiển thị form thêm người dùng
app.get('/add', (req, res) => {
  res.render('add');
});

// Xử lý thêm người dùng từ form
app.post('/add', (req, res) => {
  const { name, email } = req.body;
  const user = { name, email };

  db.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Hiển thị form sửa người dùng
app.get('/edit/:id', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', userId, (err, result) => {
    if (err) throw err;
    res.render('edit', { user: result[0] });
  });
});

// Xử lý sửa người dùng từ form
app.post('/edit/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const user = { name, email };

  db.query('UPDATE users SET ? WHERE id = ?', [user, userId], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Xóa người dùng
app.get('/delete/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const { faker } = require("@faker-js/faker");
//  Get the client
const mysql = require("mysql2");
const express = require("express");
const app = express();
const Path = require("path");
const methodOverride = require("method-override");
const { log } = require("console");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Setup ejs views directoey
app.set("view engine", "ejs");
app.set("views", Path.join(__dirname, "views"));

// database connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "instagram",
  password: "#lemontree9617", // password is madatory
});

// genrating random user data
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};
// ### routing code start from here

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
// home route
app.get("/", (req, res) => {
  let query = "SELECT count(*) FROM users";
  // res.send('Hello World , this is home page');
  try {
    connection.query(query, (err, results) => {
      if (err) throw err;
      let count = results[0]["count(*)"];
      // console.log(count);
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log("Some erros in db connection");
    res.render("home.ejs");
  }
  // connection.end();
});

// show user route

app.get("/users", (req, res) => {
  let query = "SELECT * FROM users";
  try {
    connection.query(query, (err, users) => {
      if (err) throw err;

      res.render("showUsers.ejs", { users });
    });
  } catch (err) {
    console.log("Some erros in db connection");
  }
});

// edit user route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;

  let q = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      console.log(user);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log("Some erros in db connection");
  }
});

// update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUsername, password: formPass } = req.body;
  let q = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      let user = results[0];
      console.log(user);
      if (formPass != user.password) {
        res.send("Wrong password");
      } else {
        let q2 = `UPDATE users SET username = '${newUsername}' WHERE id = '${id}'`;
        connection.query(q2, (req, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    console.log("Some erros in db connection");
  }
});

// add user route
app.get("/addUser", (req, res) => {
  console.log("here enter new user information");
  res.render("newUser.ejs");
});

app.post("/user/new", (req, res) => {
  let { id, username, email, password } = req.body;
  console.log(id, username, email, password);
  let q3 = `INSERT INTO users (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q3, (err, results) => {
      if (err) throw err;
      console.log(results);

      res.redirect("/users");
    });
  } catch (err) {
    console.log("Some erros in db connection");
  }
});

// delete user route
app.get('/user/:id/delete', (req, res) => {
  let { id } = req.params;

  let q1 = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q1, (err, results) => {
      if (err) throw err;
      let user = results[0];
      console.log("User Passowrd is = ",user.password);
      res.render('deleteUser.ejs', { user });
    });
  }
  catch (err) {
    console.log('Some erros in db connection');
  }

});
// delete user route post
app.post('/user/:id/delete', (req, res) => {
  let { id } = req.params; // ✅ Corrected here
  
  
  let { password: formPass } = req.body;
  let q1 = `SELECT * FROM users WHERE id = '${id}'`;
  try {
    connection.query(q1, (err, results) => {
    if (err) throw err;
    let user = results[0];    
    if (formPass != user.password) {
      res.send('Wrong password');
    } else {
      let q2 = `DELETE FROM users WHERE id = '${id}'`;
      connection.query(q2, (req, result) => {
        if (err) throw err;
        res.redirect('/users');
      });
    }
  });
  } catch (err) {
    console.log('Some erros in db connection');
    
    }
});

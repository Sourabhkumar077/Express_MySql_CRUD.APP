-- CREATE TABLE users (id VARCHAR(50) PRIMARY KEY, username VARCHAR(50) UNIQUE, email VARCHAR(50) UNIQUE NOT NULL,  password VARCHAR(45) NOT NULL)

-- // let query= 'CREATE TABLE users (id VARCHAR(50) PRIMARY KEY, username VARCHAR(50) UNIQUE, email VARCHAR(50) UNIQUE NOT NULL,  password VARCHAR(45) NOT NULL)';
-- let q = 'INSERT INTO users ( id ,username,email,password) VALUES ?';
-- let userData = [["123b", "123_newuserb", "abc@gmail.comb", "abcb"], ["123c", "123_newuserc", "abc@gmail.comc", "abcc"]];
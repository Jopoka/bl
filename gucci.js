const express = require ('express')
const config = require ('config')
const jsonwebtoken = require ("jsonwebtoken");
const sqlite3 = require ("sqlite3")
const sqlite = require ("sqlite")

const app = express()
sqlite({
    fileuser: "./basa/Babaha.sql",
    driver: sqlite.Database
}).then((sql) => {
    app.get('/people/register', async (req, res) => {
        const people = await db.all("select * from people")
        res.json(people)
      })
      app.get('/people/login', async (req, res) => {
        const people = await db.all("select * from people")
        res.json(people)
      })
})

const auntification = (req, res, next) => {
    const authHeader = req.headers['авторизация'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
      return res.status(401).json({ message: 'Титульный жетон' })
    }
    jwt.verify(token, secretkey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Ошибка не пройдена проверка' })
      }
      req.userEmail = decoded.userEmail
      next()
    })
  }

  app.post('/people/register', async (req, res) => {
    const user = { email, nickname, password } = req.body;

    const token = jwt.sign({ email: user.email }, secretkey, {
      expiresIn: 86000
    })

    const result = await db.all(`select * from people where email = "${email}"`)
    if (result.length > 0) {
      return res.status(400).json({ message: 'Такой email уже зарегистрирован' });
    }

    else {
      const userAdd = async (res) => {
        await db.run(`INSERT INTO People (nickname, email, password, token) VALUES ("${nickname}", "${email}", "${md5(password)}", "${token}")`, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Ошибка при считывании пользователя в базе данных.' });
          }
          res.json({
            data: "res"
          });
        }

        )
      }
      userAdd(res)
    }
    return res.json({ nickname, email, password, token });
  });


  app.post('/people/login', async function (req, res) {
    const user = {id, email, nickname, password } = req.body;
    const log = await db.all(`select * from people WHERE email = "${email}"`)
    const pass = await db.all(`select * from people WHERE password = "${md5(password)}"`)
    try {
      if ((log[0].length > 0) || (user.email === `${email}`) && (pass[0].password === `${md5(password)}`)) {
        const token = jwt.sign({ email: user.email }, secretkey, {
          expiresIn: 86000
        })
        await db.run(`update people set token = '${token}' where email = '${log[0].email}'`)
        return res.json({
          data: {
            user,
            token
          }
        })
      }
    }
    catch {
      if (pass.length === 0 || log.length === 0) {
        res.json({ message: "Не верная почта или пароль " })
      }
    }

  });
  app.post('/people/exit', async function(req, res) {
    const user= {email, password, token} = req.body;
    const log = await db.all(`SELECT * FROM People WHERE email = "${email}"`)
    // const exit = await db.run(`update token set token = ' ' where token = ${token}`)

    if (log[0].email != token){
      await db.run(`update people set token = ' ' where email = "${log[0].email}"`)
    } return res.json ({
      data: {
        user
      }
    })
  });
app.listen(3000, () => {
  console.log("fugas" + 3000)
});
app.post('/upload', upload.single('file'), authenticateUser,(req, res) => {
  const file = req.file;
  
  db.run('INSERT INTO files (name) VALUES (?)', [file.originalname], function(err) {
  if (err) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
  } else {
  res.json({ message: 'File uploaded successfully' });
  }
  });
  });



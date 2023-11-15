const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const session =  require('express-session');
const { log } = require('console');
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true, // Allow cookies to be sent with the request
};

app.use(cors(corsOptions));

app.use(cors());
app.use(express.json()); 



const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '007@dev00',
  database: 'leetcode'
});

let a = null;


app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      secure: false, // Set to true in a production environment with HTTPS
      sameSite: 'none', // Required for cross-site requests
    },
  })
);


app.get("/api/problems",(req,res)=>{
  const q1 = "select * from problem";
      db.query(q1,(err,result)=>{
        if(err){
          console.log(err);
        }
        else{
          const data1 = result.map((data, count) => {
            return {
              id: data.id,
              problem: data.problem,
              title : data.title,
              difficulty: data.difficulty,
              rating:data.rating
            }
          });
          res.json(data1);
        }
      })
})

app.post("/api/check", (req, res) => {
  const sqlq = "SELECT * FROM login";
  db.query(sqlq, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error executing SQL query');
    } else {
      const data = result.map((data, count) => {
        return {
          id: count,
          username: data.username,
          password: data.password
        }
      });
      a = data;
    }
    const u = req.body.Username;
    const p = req.body.Password;
    const findindex = a.findIndex((a) => a.username === u && a.password === p);
    if(findindex>=0){
      req.session.user={
        username:u,
      };
      console.log(req.session.user.username);
     res.json({success:true,message:"correct credentials"});
    }
    else{
      res.json({success:false,message:"wrong credentials"});
    }
  });
});

app.get("/api/profile",(req,res)=>{
  if (req.session.user && req.session.user.username) {
    const username = req.session.user.username;
    console.log(username);
    res.json({ username });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


app.post("/api/problem",(req,res)=>{
  
const id = req.body.Id;
  const q2 = "select * from problem where id = ?"
  db.query(q2,id,(err,result)=>{
    if(err){
      console.error(err);
      res.status(500).send('Error executing SQL query');
    }
    else{
      res.json(result);
    }
  })
})

app.post("/api/problem/run", (req, res) => {
  
  const code = req.body.Code;
  const lang = req.body.language;
  const input = req.body.input || ''; 
  const userCodeFile = 'user_code.cpp';
  const executable = `${userCodeFile}.out.exe`;


  fs.writeFile(userCodeFile, code, (err) => {
    if (err) {
      console.error('Error writing user code to file:', err);
      return res.status(500).json({ error: 'Error writing user code to file' });
    }

    console.log('User code was successfully written to the file:', userCodeFile);

    
    exec(`g++ ${userCodeFile} -o ${executable}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error compiling user code:', error.message);
        return res.json({ error: error.message });
      } 

      console.log('C++ code was successfully compiled');

   
      if (fs.existsSync(executable)) {
        const command = `"${path.resolve(executable)}"`;
        const childProcess = exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error('Error executing user code:', error.message);
            return res.status(500).json({ error: 'Error executing user code' });
          }

          console.log('Output:', stdout);
          console.error('Error:', stderr);

          res.json({ output: stdout, error: stderr });
        });

       
        childProcess.stdin.write(input);
        childProcess.stdin.end();
      } else {
        console.error('Error: Executable file not found');
        res.status(500).json({ error: 'Error executing user code' });
      }
    });
  });
});
app.post('/api/problem/subtable', (req, res) => {
  const correct = req.body.Correct;
  const total = req.body.Total;
  const user = req.body.User;
  const language = req.body.language;
  const code = req.body.code;
  const id = req.body.Id;
  var result = "wrong";
  if (correct === total) {
    result = "correct";
  }
  const query = "INSERT INTO submission (username, BODE, Result, id, lang, total, correct) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [user, code, result, id, language, total, correct], (error, results, fields) => {
    if (error) {
      console.error("Error inserting submission:", error);
      res.status(500).json({ error: "An error occurred while inserting submission." });
    } else {
      res.status(200).json({ message: "Submission inserted successfully." });
    }
  });
});

app.post("/api/problem/submit", (req, res) => {
  const id = req.body.Id;
  const query = "SELECT * FROM test_cases WHERE problem_id=?";
  db.query(query, id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      const testCases = result.map(data => ({
        input: data.input,
        expectedOutput: data.expected_output
      }));

      const { Code, language, input } = req.body;
      const userCodeFile = 'user_code.cpp';
      const executable = `${userCodeFile}.out.exe`;

      
      fs.writeFile(userCodeFile, Code, (err) => {
        if (err) {
          console.error('Error writing user code to file:', err);
          return res.status(500).json({ error: 'Error writing user code to file' });
        }

        console.log('User code was successfully written to the file:', userCodeFile);

        
        exec(`g++ ${userCodeFile} -o ${executable}`, (error, stdout, stderr) => {
          if (error) {
            console.error('Error compiling user code:', error.message);
            return res.json({ error: error.message });
          }

          console.log('C++ code was successfully compiled');

          if (fs.existsSync(executable)) {
            const outputResults = [];

        
            for (const testCase of testCases) {
              const command = `"${path.resolve(executable)}"`;
              const childProcess = exec(command, (error, stdout, stderr) => {
                const output = stdout.trim();
                const expectedOutput = testCase.expectedOutput.trim();
                const testResult = { input: testCase.input, output, expectedOutput, match: output === expectedOutput };
                outputResults.push(testResult);

                if (outputResults.length === testCases.length) {
                  res.json({ outputResults });
                }
              });

              childProcess.stdin.write(testCase.input);
              childProcess.stdin.end();
            }
          } else {
            console.error('Error: Executable file not found');
            res.status(500).json({ error: 'Error executing user code' });
          }
        });
      });
    }
  });
});


app.post("/api/problem/reqsubtable", (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const query = "SELECT * FROM submission WHERE id = ? AND username = ? ";

  db.query(query, [id, username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      console.log(result);
      res.json(result);
    }
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

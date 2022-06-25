const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const cpath = './public/data/uploads/';
const tpath = './public/data/temp/';
const bcrypt = require('bcrypt');
const pool = require('./db');
const multer = require('multer');
const cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        console.log("------", req.files);
        callBack(null, cpath)     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        console.log("=====>>>",file)
        var date = new Date();
        const hash = crypto.createHash('sha256').update(file.originalname + date.getTime()).digest('hex');
        callBack(null, hash);
    }
});

const upload = multer({
    storage: storage
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.post('/stats', upload.single('uploaded_file'), function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    console.log(req.file);
    const { user_id, user_name } = req.body;
    //var query = "INSERT INTO uploads(file,file_name) values(" + req.file.buffer + "," + req.file.originalname + ")";
    var query = "INSERT INTO uploads (file_hash, file_name, owner_id, blocked_status) values ($1, $2, $3, $4)"
        values = {

            file_name: req.file.originalname,
            file: null,
            hash: req.file.filename

        };
    var content = req.file.buffer;
    pool.query(query, [req.file.filename, req.file.originalname,user_id,'FALSE'],function (err, data) {
        if (!err)
            console.log("file saved in database successfully");
    })
    /* fs.unlink(req.file.path, (err => {
        if (err) console.log(err);
        else {
            console.log("\nDeleted");
        }
    })); */
    //res.download(req.file.path);
    //res.download(downloadFile(cpath + req.file.originalname));
    //downloadFile(req.file.filename);
    res.send(req.file.filename);
});


app.get('/load', async function (req, res) {
    console.log(req.query.file);
    const hash = req.query.file;
    const from = cpath + hash;
    var fileName;

    pool.query('SELECT * FROM uploads WHERE file_hash=$1', [hash], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            //to = tpath + rows[0].file_name;
            fileName = rows.rows[0].file_name;
            console.log(from, fileName);
            //fs.createReadStream(from).pipe(fs.createWriteStream(to));
            downloadFile(res,from,fileName);


            /* fs.copyFileSync(cpath + hash, cpath + hash, (err) => {
                if (err) throw err;

                console.log('source.txt was copied to destination.txt');
            }); */
        }

        else
            console.log(err);


    })


    //res.send("completed!");
    //res.setHeader('Content-disposition', 'attachment; filename=logo.png');
    //res.setHeader('Keep-Alive', 'timeout=100');

    //es.download('./public/data/temp/logo.png');
    //downloadFile(res, from, fileName);


});



// app.get('/learners', (req, res) => {
//     pool.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })

// });

// app.get('/learners/:id', (req, res) => {
//     console.log(req.params);
//     pool.query('SELECT * FROM learnerdetails WHERE learner_id = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })
// });


// app.post('/learners', (req, res) => {
//     let learner = req.body;
//     console.log(learner);
//     var sql = "SET @learner_id = ?; SET @learner_name = ?;SET @learner_email = ?; SET @course_Id = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_Id);";
//     mySqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, rows, fields) => {
//         if (!err)
//             rows.forEach(element => {
//                 if (element.constructor == Array)
//                     res.send('New Learner ID : ' + element[0].learner_id);
//             });
//         else
//             console.log(err);
//     })

// });

// async function readFileContent(fileName) {
//     //binary
//     const data = await fs.readFile(fileName, "binary");
//     return Buffer.from(data);
// }

async function downloadFile(res, from, fileName) {
    //res.setHeader('Content-disposition', 'attachment; filename=');
    //res.setHeader('Keep-Alive', 'timeout=100');
    console.log("from download ", fileName);
    res.download(
        from,
        fileName, // Remember to include file extension
        (err) => {
            if (err) {
                res.send({
                    error: err,
                    msg: "Problem downloading the file"
                })
            }
        });

}




app.post('/login', async (req, res)=> {
    const potentialLogin = await pool.query("SELECT user_id, username, passhash FROM users WHERE username=$1", [req.body.username]);
    if(potentialLogin.rowCount > 0){
        //found user
        const isSamePassword = await bcrypt.compare(req.body.password, potentialLogin.rows[0].passhash);
        if(isSamePassword) {
            //login
            
            res.send({loggedIn: true, status: "Successfully LoggedIn", user_id:potentialLogin.rows[0].user_id, username:potentialLogin.rows[0].username});
        }   
        else{
            //not good login
            res.send({loggedIn: false, status: "wrong username or password"});
        }
    }else{
        res.send({loggedIn: false, status: "wrong username or password"});
    }
   

  
})


app.post('/signup', async (req, res)=> {
    const { username, password } = req.body
    console.log(username,"----",password)
    const existingUser = await pool.query("SELECT username FROM users WHERE username=$1", [username]);
    if(existingUser.rowCount === 0){
        //register new users    
        const hashedPass = await bcrypt.hash(password, 10);
        const newUserQuery = await pool.query("INSERT INTO users (username, passhash) values ($1, $2) RETURNING username", [username, hashedPass]);
        const gettingUser = await pool.query("SELECT user_id, username FROM users WHERE username=$1", [username])
        res.send({loggedIn: true, user_id:gettingUser.rows[0].user_id, username:gettingUser.rows[0].username})
    }else{
        res.send({ loggedIn:false, status: 'Username Already Taken'});
    }
})


app.get('/getallfiles', async (req,res) => {
    await pool.query("SELECT * FROM uploads",(err, rows, files) => {
        if(!err){
            res.send(rows)
        }
    })
})
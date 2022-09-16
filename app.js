const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const sgClient = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail')
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


const app =  express();

dotenv.config({ path: './.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const connection  = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    password : process.env.DB_PASS,
    database : process.env.DB
});



app.listen(3000, () => {
    console.log("Server is runnin on http://localhost:3000");
});

app.use(
    cors({
    origin: '*',
    })
);


app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//REGISTER USER

app.post('/SignUp', (req, res)=>{
    
    console.log('app.js (form payload)', req.body);

    
    let foreignKeys = {};


    //check if email or st_number already exists in the DB
    connection.query('SELECT count(*) as count FROM users WHERE email = ? OR student_number = ?', [req.body.email, req.body.student_number], function (error, results, fields) {
        if (error) {
            console.log(err);
            res.status(500).json({
                message: 'Something went wrong querying the database for existing users',
                status: 500
            });
            return;
        }

        //how many records returned off the provided user information
        if(results[0].count > 0){
            //user already exists matching provided details
            
            console.log('User matching student number/email already exists!');
            
                      
           res.cookie('message', 'user-found' , {httpOnly:false,maxAge:3000})

            

            res.sendFile(path.join(__dirname,'./pages/Create Account Page.html'));            
            return;
        }else{

            //no user exists with those details...
            //create user with provided details

                //create allergy record
                connection.query('INSERT INTO allergies SET allergy_description = ?', req.body.allergies , function (error, results, fields) {
                if (error) 
                {
                    console.log('There was an error while creating user allergy record');
                    res.status(500).json({
                        message: 'There was an error while creating user allergy record',
                        status: 500
                    });
                    return;
                }

                //saveID of inserted record
                foreignKeys['allergyId'] = results.insertId;
                

                    //create address record
                    connection.query('INSERT INTO addresses SET address_description = ?', req.body.address , function (error, results, fields) {
                    if (error) 
                    {
                        console.log('There was an error while creating user address record');
                        res.status(500).json({
                            message: 'There was an error while creating user address record',
                            status: 500
                        });
                        return;
                    }


                        //saveID of inserted record
                        foreignKeys['addressId'] = results.insertId;
                        
                
                        //hash + salt pass
                        const hash =  bcrypt.hashSync(req.body.password, 10);

                        const payload = {

                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            student_number: req.body.student_number,
                            email:  req.body.email,
                            password: hash,
                            phone_number: req.body.phone_number,
                            allergies: req.body.allergies,
                            address: req.body.address,
                            gender: req.body.gender,
                            DOB: req.body.DOB,
                            validated: 0

                        }

                
                        //create user record with foreign key for allerdyID and addresID
                        connection.query('INSERT INTO users SET ?', payload, function (error, results, fields) {
                        if (error) 
                        {
                            console.log('There was an issue inserting the new user into the DB');
                            res.status(500).json({
                                message: 'There was an issue inserting the new user into the DB',
                                status: 500
                            });
                            return;
                        }
                            
                            //create verification link
                            const currentUrl = "http://localhost:3000/";
                            const uniqueString = uuidv4() + results.insertId;
                            
                            const url = currentUrl + "verify/" + results.insertId + "/" + uniqueString;
                            console.log('url:',url);

                            //create mail
                            const msg = {
                                "personalizations": [{
                                        "to": [{
                                                "email": payload.email
                                            }],
                                            "dynamic_template_data": {
                                                "link": url,
                                                "name": payload.first_name
                                            }
                                        }
                                    ],
                                    "from": {
                                        "email": "nvonderbecke@gmail.com"
                                        },
                                    "template_id": "d-7d23deb79ff44c34854d44d9a5be4179"
                            }

                            //hash the unique verification string
                            const hashedUniqueString = bcrypt.hashSync(uniqueString, 10);

                            connection.query('INSERT INTO user_verifications(user_id, unique_string) values(?,?)', [results.insertId, hashedUniqueString], function (error, results, fields)
                            {
                                if (error) 
                                {
                                    console.log('There was an issue inserting the verification record into the DB!');
                                    res.status(500).json({
                                        message:'There was an issue inserting the verification record into the DB!',
                                        status: 500
                                    });
                                    return;
                                }


                                //send user mail to verifiy
                                sgMail.send(msg)
                                .then(() => console.log('Mail sent successfully'))
                                .catch(error => {
                                console.error(error);
                                
                                res.status(500).json({
                                    message:'There was an issue sending the verificationmail to the user!',
                                    status: 500
                                });
                                return;

                                });

                            });

                            console.log('User #',results.insertId,' Succesfuly created!');

                            //ceate short-lived cookie to notify user to vlidate on next page
                            
                            res.cookie('message', 'success',{
                                httpOnly: false,
                                maxAge:3000} );
                            console.log('before redirect');
                            
                            return res.redirect('/');

                        });

                });



            });

        }

       
    });

    
});


//VERIFY USER ACCOUNT

app.get('/verify/:userId/:uinqueString', (req, res)=>{

    let {userId, uinqueString} = req.params;

    connection.query("SELECT * FROM user_verifications where user_id = ?", userId, (error, results, fields)=>{
        if (error) 
        {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        console.log('UV: ',results[0]);
        console.log('hashed Unique string',results[0]['unique_string']);
        const uvID = results[0]['id'];
        console.log('id before (uv)',uvID);
        if (bcrypt.compareSync(uinqueString,results[0]['unique_string']))
        {
            //validation was succesful
            console.log('validation was succesful');
            connection.query("UPDATE users SET validated = 1 where id = ?", results[0]['user_id'], (error, results, fields)=>{
                if (error) 
{
    console.log(err);
    res.sendStatus(500);
    return;
}

                //remove user_validation record

                console.log('id in (uv)',uvID);
                connection.query("DELETE from user_verifications where id = ?", uvID, ()=>{
                    if (error) 
                    {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    console.log('GOING TO VERIFY (INSCOPE)');
                });
                console.log('GOING TO VERIFY');
                //user has been validated and user_validation record removed
                res.redirect('/Verified');
            })
        }else{
            //else serve up un unsuccessful page
            console.log('validation was UNsuccesful');
            res.redirect('/Denied');
        }

    });

});

app.get('/Verified',(req,res)=>{
    res.sendFile(path.join(__dirname,'./pages/Verify.html'));
});

app.get('/Login', (req, res) =>{
    res.sendFile(path.join(__dirname,'./pages/Log In Page.html'));
})
// SIGN INTO ACCOUNT

app.post('/Login', (req, res) => {
   

       console.log('payload:',req.body);

        const payload = {
            email: req.body.email,
        };
        
       //check is user matching email exists
        connection.query('SELECT count(*) as count, id, password, validated, email, first_name, last_name, student_number, phone_number, allergies, address, gender, DOB FROM users WHERE email = ?', [payload.email] , function (error, results, fields) {
            if (error) 
            {
                throw error;
                res.status(500).json({
                    message:'Problem with trying to look up students record',
                    status: 500
                });
                return;
            }

            console.log(results[0]);

            //no user returned
            if(results[0].count < 1){
                console.log('No user matching provided email! Either sign up, or try again.');

                res.cookie('message', 'no-user',{httpOnly:false, maxAge:1500})

                res.redirect('/Login');
            }else
            if(results[0].validated==0){

                res.cookie('message', 'not-verified',{httpOnly:false, maxAge:1500})

                res.redirect('/Login');

            }else
            if(results[0].validated==1){
                //user verified email address

                 //compare fovent text password with salted hash on DB
                 let pass = bcrypt.compareSync(req.body.password, results[0].password)
        
                 if(!pass){
                     console.log("Paswors DO NOT MATCH");

                     res.cookie('message', 'Email and password does not match!')

                     res.status(401).json({
                        message: 'Email and password does not match!',
                        status:403
                     });
                     return;
                 }


// [results[0].id, student_number: results[0].student_number, name: results[0].first_name, last_name: results[0].last_name, email: results[0].email, phone_number: results[0].phone_number, allergies: results[0].allergies, address: results[0].address, gender: results[0].gender, DOB: results[0].DOB]
                 jwt.sign({userId:results[0].id, student_number: results[0].student_number, name: results[0].first_name, last_name: results[0].last_name, email: results[0].email, phone_number: results[0].phone_number, allergies: results[0].allergies, address: results[0].address, gender: results[0].gender, DOB: results[0].DOB},process.env.TOKEN_SECRET, {expiresIn:"1h"},function(error, token) {
                    if (error) throw error;

                    res.cookie('token', token,{httpOnly:false, maxAge:300000});
                    console.log("Token created!");
                    res.redirect('/User');
                    
                    
                 });

                 
                 

            }

        });

});


function validate(req,res,next){

    console.log('cookie:',req.cookies.token);

    jwt.verify(req.cookies.token, process.env.TOKEN_SECRET, (error, user) =>{

        if (error){
            res.cookie('message','error',{httpOnly:false, maxAge:3000});
            res.redirect('/Denied');
            return;
        } 

        res.cookie('userId', user.userId, {httpOnly:false, maxAge:3000});
        res.cookie('student_number', user.student_number, {httpOnly:false, maxAge:3000});
        res.cookie('user-name', user.name, {httpOnly:false, maxAge:3000});
        res.cookie('last_name', user.last_name, {httpOnly:false, maxAge:3000});
        res.cookie('address', user.address, {httpOnly:false, maxAge:3000});
        res.cookie('phone_number', user.phone_number, {httpOnly:false, maxAge:3000});
        res.cookie('gender', user.gender, {httpOnly:false, maxAge:3000});
        res.cookie('DOB', user.DOB, {httpOnly:false, maxAge:3000});
        res.cookie('allergies', user.allergies, {httpOnly:false, maxAge:3000});
        res.cookie('email', user.email, {httpOnly:false, maxAge:3000});

        next();

    });

}

app.get('/User', validate, (req,res)=>{
    console.log('here: /User');
    
    res.sendFile(path.join(__dirname,'./pages/User Signed In Page.html'));
});

app.post('/User', validate, (req,res)=>{
    console.log('(POST) payload:'+req.body.first_name);

    const hash =  bcrypt.hashSync(req.body.password, 10);

    const payload = {

        // id: req.body.userId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hash,
        phone_number: req.body.phone_number,
        allergies: req.body.allergy,
        address: req.body.address,
        gender: req.body.gender,
        DOB: req.body.DOB

    }

    console.log(payload);

    connection.query("UPDATE users SET ? where id = ?", [payload, req.body.userId], (error, results, fields) =>{
        if(error){
            throw error;
        }

        console.log("worked?");

    });
    
    res.redirect('/');
    
});


app.get('/',express.static('public'),(req, res)=>{
    
    // res.cookie('pwd', path.join(__dirname,'../website-app/current/Home Page.html'),{
    //     httpOnly: false,
    //     maxAge:3000} );
    
    console.log('redirecting to:'+path.join(__dirname,'./pages/Home Page.html')+'....');
    res.sendFile(path.join(__dirname,'./pages/Home Page.html'));

});

//validate

app.get('/Denied',(req, res)=>{
    
    console.log('redirecting to:'+path.join(__dirname,'./public/Denial.html')+'....');
    res.sendFile(path.join(__dirname,'./pages/Denial.html'));

})

app.get('/SignOut', (req, res)=>{

    res.cookie('token','',{httpOnly:false,maxAge:300});
    res.sendFile(path.join(__dirname, './pages/Home Page.html'));

});


app.get('/Contact', (req, res)=>{
    res.sendFile(path.join(__dirname,'./pages/Contact Page.html'))
});

app.get('/Register', (req, res)=>{
    res.sendFile(path.join(__dirname,'./pages/Create Account Page.html'))
});

app.get('/Recovery', (req, res) =>{

    res.sendFile(path.join(__dirname,'./pages/Forgot Password.html'))

})
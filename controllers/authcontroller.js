const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.signup = async(req,res) => {
    try {
        const { name, email, password, role} = req.body;
        
        //check user exists in database
        const existsUser = await User.findOne({email});
        if(existsUser){
            return res.status(400).json({success: false,
                message: 'User already exists!',
            });
        }
        //secured the password
        let hashedPassword = '';
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return res.status(500).json({ success: false,
                message: error.message, });
        }
        //create new user
        const newuser = {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({ success: true,
            message: 'User created successfully!',});
    }
    catch(error){
        return res.status(500).json({ success: false,
            message: "User cannot be registered ! try later !" + error.message
        });
    }
}

exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;
        
        //Requie data passed or not
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Username/ password should not be blank !',
            });
        }
        //check user exists in the database or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User does not exists!',
            });
        }
        //Verify the password and generate the JWT token
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }
            //if password match then create jwt token
            const token = jwt.sign(
                payload, 
                process.env.JWT_SECRET,
                {
                    expiresIn:"24h",
                }
            );
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), 
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                    success: true,
                    token,
                    user,
                    message: 'Logged in successfully!'
                })
        }
        else{
            return res.status(403).json({
                success: false, message: 'Password is incorrect!',
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'failed to logon the application!'
        })
    }
}

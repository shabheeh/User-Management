const User = require("../Models/mainModel");
const bcrypt = require('bcrypt');

const mobRegex = /^(?!0|1)\d{10}$/;
const emailRegex = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+\.([a-z]+)(\.[a-z]+)?$/;
const nameRegex = /^[a-z ,.'-]+$/i;


const loadSignUp = async (req, res) => {
    try {
        res.render('Users/signUp', { 
            signupMessagename: '',
            signupMessagemail: '',
            signupMessagepass: '',
            signupMessagemob: '',
            signupMessage: '',  
            formData: '' });
    } catch (error) {
        console.log(error.message + " user loadSignUp");
    }
}

const insertUser = async (req, res) => {
    try {
        // Extracting and trimming input fields
        const username = req.body.username.trim();
        const email = req.body.email.trim();
        const mobile = req.body.mobile.trim();
        const password = req.body.password.trim();

        // Check if all required fields are filled and not just spaces
        if (!username || !email || !mobile || !password) {
            return res.render('Users/signUp', { 
                signupMessage: 'All required fields must be filled', 
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
            });
        }

        // Validate username
        if (!nameRegex.test(username)) {
            return res.render('Users/signUp', {
                signupMessagename: "Name shouln't contain any special characters", 
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',  
                formData: { username, email, mobile }
            });
        }

        // Validate email
        if (!emailRegex.test(email)) {
            return res.render('Users/signUp', { 
                signupMessagemail: 'Invalid email',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',  
                formData: { username, email, mobile }
            });
        }

        // Validate mobile
        if (!mobRegex.test(mobile)) {
            return res.render('Users/signUp', {  
                signupMessagemob: 'Invalid mobile number', 
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessage: '',
                formData: { username, email, mobile }
            });
        }

        // Validate password length (for example, must be at least 6 characters)
        if (password.length < 4) {
            return res.render('Users/signUp', {
                signupMessagepass: 'Password must be at least 4 characters', 
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagemob: '',
                signupMessage: '',  
                formData: { username, email, mobile }
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('Users/signUp', {
                signupMessagemail: 'Email already exists. Please use a different email.',
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',  
            });
        }

        // Hash the password
        const securePassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const user = new User({
            username,
            email,
            mobile,
            password: securePassword,
            isAdmin: false,
            doc: new Date().toLocaleDateString()
        });

        // Save the user to the database
        const userData = await user.save();

        // If user saved successfully, render the signup page with a success message
        if (userData) {
            res.render('Users/signUp', { 
                signupMessage: 'Sign up success, Now Sign in', 
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                formData: {}
            });
        }
    } catch (error) {
        console.log(error.message + ' user insertUser');
        return res.render('Users/signUp', { 
            signupMessage: 'An error occurred, please try again', 
            formData: { username: req.body.username, email: req.body.email, mobile: req.body.mobile },
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: ''
        });
    }
};




const redirectToSignIn = (req, res) => {
    res.redirect('/signin');
}

const loadSignIn = async (req, res) => {
    try {
        res.redirect('/signin');
    } catch (error) {
        console.log(error.message + 'user loadSignin');
    }
}

const checkSignIn = async (req, res) => {
    try {
        res.render('Users/signIn');
    } catch (error) {
        console.log(error.message + ' user checkSignin');
    }
}

const verifySignIn = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email });

        if (userData) {
            const isPassMatch = await bcrypt.compare(password, userData.password);
            
            if (isPassMatch) {
                req.session.isLoggedIn = true;
                if(userData.isAdmin){
                    req.session.isAdmin = true;
                    res.redirect('/adminhome');
                } else {
                    req.session.user = userData._id;
                    res.redirect('/userhome');
                }
            } else {
                res.render('Users/signIn', { signinMessage: 'Invalid password' });
            }
        } else {
            res.render('Users/signIn', { signinMessage: 'Invalid Email or Password' });
        }
    } catch (error) {
        console.log(error.message + ' user veryfysignin');
    }
}

const loadHome = async (req, res) => {
    try {
        if (req.session.user) {
            const userData = await User.findById({_id:req.session.user});
            res.render('Users/userHome', { user: userData });
        } else {
            res.redirect('/signin');
        }
    } catch (error) {
        console.log(error.message + ' user loadhome');
    }
}

const loadSignOut = async(req, res) => {
    try {
        req.session.destroy();
        res.redirect('/signin');
    } catch (error) {
        console.log(error.message + ' user loadsignout');
    }
}



module.exports = {
    redirectToSignIn,
    loadSignUp,
    insertUser,
    checkSignIn,
    loadSignIn,
    verifySignIn,
    loadHome,
    loadSignOut,
    
}

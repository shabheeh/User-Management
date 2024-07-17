const User = require("../Models/mainModel");
const bcrypt = require('bcrypt');

const mobRegex = /^(?!0|1)\d{10}$/;
const emailRegex = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+\.([a-z]+)(\.[a-z]+)?$/;
const nameRegex = /^[a-z ,.'-]+$/i;

const loadAdminHome = async (req, res) => {
    try {
        const userData = await User.find({ isAdmin: false });
        res.render('Admin/adminHome', { users: userData,
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            signupMessage: '',
         });
    } catch (error) {
        console.log(error.message + " error at admincontroller loadAdminHome");
    }
}

const addUser = async (req, res) => {
    try {
        // Extracting and trimming input fields
        const username = req.body.username.trim();
        const email = req.body.email.trim();
        const mobile = req.body.mobile.trim();
        const password = req.body.password.trim();

        // check for empty fields
        if (!username || !email || !mobile || !password) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessage: 'All required fields must be filled',
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
                users: usersData
            });
        }

        // Validate username
        if (!nameRegex.test(username)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagename: "Name shouldn't contain any special characters",
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Validate email
        if (!emailRegex.test(email)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemail: 'Invalid email',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Validate mobile
        if (!mobRegex.test(mobile)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemob: 'Invalid mobile number',
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Validate password length 
        if (password.length < 4) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagepass: 'Password must be at least 4 characters',
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagemob: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Check email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemail: 'Email already exists. Please use a different email.',
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',
                users: usersData
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

        // If user saved successfully, render the admin home page with a success message
        if (userData) {
            const usersData = await User.find({ isAdmin: false });
            res.render('Admin/adminHome', {
                signupMessage: 'User added successfully',
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                formData: {},
                users: usersData
            });
        }
    } catch (error) {
        console.log(error.message + ' admin addUser');
        const usersData = await User.find({ isAdmin: false });
        return res.render('Admin/adminHome', {
            signupMessage: 'An error occurred, please try again',
            formData: { username: req.body.username, email: req.body.email, mobile: req.body.mobile },
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            users: usersData
        });
    }
};

const updateUser = async (req, res) => {
    try {
        
        const username = req.body.username ? req.body.username.trim() : '';
        const email = req.body.email ? req.body.email.trim() : '';
        const mobile = req.body.mobile ? req.body.mobile.trim() : '';

        // Check if all required fields are filled and not just spaces
        if (!username || !email || !mobile) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessage: 'All required fields must be filled',
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
                users: usersData
            });
        }

        // Validate username
        if (!nameRegex.test(username)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagename: "Name shouldn't contain any special characters",
                signupMessagemail: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Validate email
        if (!emailRegex.test(email)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemail: 'Invalid email',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Validate mobile
        if (!mobRegex.test(mobile)) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemob: 'Invalid mobile number',
                signupMessagemail: '',
                signupMessagename: '',
                signupMessagepass: '',
                signupMessage: '',
                formData: { username, email, mobile },
                users: usersData
            });
        }

        // Check if email already exists (excluding the current user's email)
        const existingUser = await User.findOne({ email, _id: { $ne: req.body.userId } });
        if (existingUser) {
            const usersData = await User.find({ isAdmin: false });
            return res.render('Admin/adminHome', {
                signupMessagemail: 'Email already exists. Please use a different email.',
                formData: { username, email, mobile },
                signupMessagename: '',
                signupMessagepass: '',
                signupMessagemob: '', 
                signupMessage: '',
                users: usersData
            });
        }

        // Update the user
        const userData = await User.findByIdAndUpdate(
            { _id: req.body.userId },
            { $set: { username, email, mobile } }
        );

        const usersData = await User.find({ isAdmin: false });
        res.render('Admin/adminHome', {
            signupMessage: '',
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            users: usersData
        });
    } catch (error) {
        console.log(error.message + ' admin updateuser');
        const usersData = await User.find({ isAdmin: false });
        res.render('Admin/adminHome', {
            signupMessage: 'An error occurred, please try again',
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            users: usersData
        });
    }
};


// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        await User.findByIdAndDelete(id);

        const usersData = await User.find({ isAdmin: false });
        res.render('Admin/adminHome', {
            signupMessage: 'User deleted successfully',
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            users: usersData
        });
    } catch (error) {
        console.log(error.message + " error at admincontroller deleteUser");
        const usersData = await User.find({ isAdmin: false });
        res.render('Admin/adminHome', {
            signupMessage: 'An error occurred, please try again',
            signupMessagemail: '',
            signupMessagename: '',
            signupMessagepass: '',
            signupMessagemob: '',
            users: usersData
        });
    }
};


module.exports = { 
    loadAdminHome,
    addUser,
    updateUser,
    deleteUser
}

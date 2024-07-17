const express = require("express");
const router = express.Router(); 


const auth = require('../Middlewares/auth');


const userController = require("../Controllers/userController");
const adminController = require("../Controllers/adminController");

// User routes
router.get("/", auth.isSignedOut, auth.isSignedOutAd, userController.redirectToSignIn);
router.get("/signin", auth.isSignedOut, auth.isSignedOutAd, userController.checkSignIn);
router.post("/signin", userController.verifySignIn); 
router.get("/user/signup", auth.isSignedOut, userController.loadSignUp);
router.post('/signup', userController.insertUser);
router.get("/userhome", auth.isSignedIn, userController.loadHome);
router.get('/signout', auth.isSignedIn, userController.loadSignOut);


// router.get('/username',(req, res) =>{
    
//     const name = req.body.name

//     const user = UserData.find({name: name})

//     res.send(user)
// })


// Admin routes
router.get("/adminhome", auth.isAdmin, adminController.loadAdminHome);
router.post('/adduser', adminController.addUser);
router.post('/admedituser', adminController.updateUser);
router.post('/deleteuser', adminController.deleteUser);

// Catch-all route to redirect to sign-in page
router.get('*', (req, res) => {
    res.redirect('/signin');
});

module.exports = router;

const isSignedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/signin');
    }
}

const isSignedOut = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/userhome');
    }
} 

const isSignedOutAd = (req, res, next) => {
    if (!req.session.isAdmin) {
        next();
    } else {
        res.redirect('/adminhome');
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/signin');
    }
}

module.exports = {
    isSignedIn,
    isSignedOut,
    isAdmin,
    isSignedOutAd
}
 
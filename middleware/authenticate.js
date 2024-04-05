// Middleware to authenticate user
export const authenticateUser = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        // If user is not logged in, respond with an error message or redirect to login page
        res.status(401).json({ error: 'Unauthorized: You must be logged in to access this resource' });
        // Alternatively, you can redirect the user to the login page:
        // res.redirect('/login');
    }
};

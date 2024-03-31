const express = require('express')
const router = express.Router()

const { login, signup } = require('../controllers/authcontroller');
const {auth, isStudent, isAdmin} = require('../middlewares/authmw');

router.post('/login', login);
router.post('/signup', signup);

//set permission on route
router.get('/general', auth, (req,res) => {
    res.json({
        success: true,
        message: 'Welcome to page - General Page',
    })
});

//Student route + middleware
router.get('/student', auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to page - Student Page',
    })
});

//Admin route + middleware
router.get('/admin', auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to page - Admin Page',
    })
});

module.exports = router;

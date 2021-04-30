const router = require('express').Router();
const sequelize= require('../config/connection');
const { BlogPost, User, Comment } = require('../models');



router.get('/', (req,res) => {
    
});

module.exports = router
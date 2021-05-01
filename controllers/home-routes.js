const router = require('express').Router();
const sequelize= require('../config/connection');
const { BlogPost, User, Comment } = require('../models');



router.get('/', (req,res) => {
    BlogPost.findAll({
        attributes: [
            'id',
            'title',
            'blog_text',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE blogpost.id = likes.blogpost_id)'), 'like_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'blogpost_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbBlogData => {
        // pass single blogpost object into homepage template
        const blogposts = dbBlogData.map(blogpost => blogpost.get({plain: true}));
        res.render('homepage', {blogposts});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/login', (req, res) => {
res.render('login');
});

module.exports = router
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
        res.render('homepage', {
            blogposts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/login', (req, res) => {
res.render('login');
});

router.get('/blogposts/:id', (req, res) => {
    BlogPost.findOne({
        where: {
          id: req.params.id
        },
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
      })
        .then(dbBlogData => {
          if (!dbBlogData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
          }
    
          // serialize the data
          const blogposts = dbBlogData.get({plain: true})
    
          // pass data to template
          res.render('single-post',  {
              blogposts,
              loggedIn: req.session.loggedIn
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})
module.exports = router
const router = require('express').Router();
const sequelize= require('../config/connection');
const { BlogPost, User, Comment } = require('../models');
const auth = require('../utils/authorazation');

router.get('/', auth, (req, res) => {
   BlogPost.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id
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
        // serialize data before passing to template
        // the below variable will be name used in partials and on template pages!!!!!
        const post = dbBlogData.map(post => post.get({ plain: true }));
        res.render('dashboard', { post, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/edit/:id', auth, (req, res) => {
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
              res.status(404).json({message: 'no post found with this id'});
              return;
          }
          // serialize the data
          const blogpost = dbBlogData.get({plain:true});
  
          // pass data to template
          res.render('edit-blogpost',  {
         blogpost,
         loggedIn: req.session.loggedIn
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });

    }); 
  

module.exports = router;
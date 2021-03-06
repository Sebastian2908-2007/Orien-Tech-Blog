const router = require('express').Router();
const {BlogPost, User, Likes, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const auth = require('../../utils/authorazation');

// get all blogposts

router.get('/', (req, res) => {
    BlogPost.findAll({
        attributes: ['id' ,'title', 'blog_text', 'user_id', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE blogpost.id = likes.blogpost_id)'), 'like_count']  
    
    ],
        // this make order from newest to oldest
        order: [['created_at', 'DESC']],
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
            },
        ]

    })
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) => {
    BlogPost.findOne({
        where: {
            id: req.params.id 
        },
        attributes: ['id', 'blog_text','title', 'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE blogpost.id = likes.blogpost_id)'), 'like_count'] 
    ],
        include: [
            {
            model: User,
            attributes: ['username']
            }
      ]
    })
    .then(dbBlogData => {
        if(!dbBlogData) {
            res.status(404).json({message: 'no blogpost found with that id'});
            return;
        }
        res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
 });


router.post('/', auth, (req, res) => {
    BlogPost.create({
        title: req.body.title,
        blog_text: req.body.blog_text,
        user_id: req.session.user_id
    })
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// /api/blogposts/like
router.put('/like', auth, (req, res) => {
 // make sure the session exists first
 if (req.session) {
    // pass session id along with all destructured properties on req.body
    BlogPost.upvote({ ...req.body, user_id: req.session.user_id }, { Likes, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

router.put('/:id', auth, (req,res) => {
    BlogPost.update(
        {
            title: req.body.title,
            blog_text: req.body.blog_text
        },
        {
            where: {
                id: req.params.id 
            }
        }
    )
    .then(dbBlogData => {
        if(!dbBlogData) {
            res.status(404).json({message: 'no post with that id'});
            return;
        }
        res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', auth, (req, res) => {
    BlogPost.destroy({
        where: {
            id: req.params.id 
        }
    })
    .then(dbBlogData => {
      if(!dbBlogData) {
          res.status(404).json({message: 'no post with that id'});
          return;
      }
      res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
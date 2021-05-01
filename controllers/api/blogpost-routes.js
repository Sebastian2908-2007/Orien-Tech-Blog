const router = require('express').Router();
const {BlogPost, User, Likes, Comment} = require('../../models');
const sequelize = require('../../config/connection');


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


router.post('/', (req, res) => {
    BlogPost.create({
        title: req.body.title,
        blog_text: req.body.blog_text,
        user_id: req.body.user_id
    })
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// /api/posts/like
router.put('/like', (req, res) => {
BlogPost.upvote(req.body, { Likes })
.then(updatedPostData => res.json(updatedPostData))
.catch(err => {
  console.log(err);
  res.status(400).json(err);
 });
});

router.put('/:id', (req,res) => {
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

router.delete('/:id', (req, res) => {
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
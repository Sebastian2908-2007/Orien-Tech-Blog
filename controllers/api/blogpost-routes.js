const router = require('express').Router();
const {BlogPost, User, Like, Comment} = require('../../models');
const sequelize = require('../../config/connection');

// get all blogposts

router.get('/', (req, res) => {
    BlogPost.findAll({
        attributes: ['id' ,'title', 'blog_text', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
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
        attributes: ['id', 'blog_text','title', 'created_at'],
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

 


module.exports = router;
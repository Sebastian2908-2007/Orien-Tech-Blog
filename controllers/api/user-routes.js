const router = require('express').Router();
const {User,BlogPost, Likes, Comment} = require('../../models');


router.get('/', (req,res) => {
    User.findAll({})
    .then(dbBlogData => res.json(dbBlogData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id 
        },
        include: [
            {
            model: BlogPost,
            attributes: ['id', 'title', 'blog_text', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text','created_at'],
                include: {
                    model: BlogPost,
                    attributes: ['title'] 
                }
            },
            {
                model: BlogPost,
                attributes: ['title'],
                through: Likes,
                as: 'liked_blogposts'
            }
        ]
    }).then(dbBlogData => {
        if(!dbBlogData) {
            res.status(400).json({message: 'no user found with this id'});
            return;
        }
        res.json(dbBlogData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/',  (req, res) => {
User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password 
})
.then(dbBlogData => {
    req.session.save(() => {
        req.session.user_id = dbBlogData.id;
        req.session.username = dbBlogData.username;
        req.session.loggedIn = true;

        res.json(dbBlogData);
    })
   })
 });

 router.post('/login', (req, res) => {
     User.findOne({
         where: {
             email: req.body.email
         }
     })
     .then(dbBlogData => {
         if(!dbBlogData) {
             res.status(400).json({message: 'no user with that email adress!'});
             return;
         }
         const validPassword = dbBlogData.checkPassword(req.body.password);
         if(!validPassword) {
             res.status(400).json({message: 'incorrect password'});
             return;
         }
         req.session.save(()=> {
             // declare session variables
             req.session.user_id = dbBlogData.id;
             req.session.username = dbBlogData.username;
             req.session.loggedIn = true;

             res.json({user: dbBlogData, message: 'you are officially logged in!'});
         })
     })
 });

 router.put('/:id',  (req,res) => {
     User.update(req.body, {
         individualHooks: true,
         where: {
             id: req.params.id 
         }
     })
     .then(dbBlogData => {
         if(!dbBlogData[0]) {
        res.status(404).json({message: 'no user found with that data'});
         return;       
        }
        res.json(dbBlogData);
     })
     .catch(err => {
         console.log(err);
         res.status(500).json(err);
     })
 });

 router.delete('/:id', (req, res) => {
     User.destroy({
         where: {
             id: req.params.id 
         }
     })
     .then(dbBlogData => {
         if(!dbBlogData) {
             res.status(404).json({message: 'no user found with that id'});
             return;
         }
         res.json(dbBlogData);
     })
     .catch(err=> {
         console.log(err);
         res.status(500).json(err);
     })
 });


 router.post('/logout', (req, res) => {
     if(req.session.loggedIn) {
         req.session.destroy(() => {
             res.status(204).end();
         })
     }else{
         res.status(404).end();
     }
 });

module.exports = router;
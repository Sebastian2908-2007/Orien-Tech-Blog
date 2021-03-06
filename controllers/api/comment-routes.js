const router = require('express').Router();
const {Comment} = require('../../models');
const auth = require('../../utils/authorazation');

router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['id', 'comment_text']
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.post('/', auth, (req, res) => {
   if (req.session) { 
    Comment.create({
        comment_text: req.body.comment_text,
        blogpost_id: req.body.blogpost_id,
        user_id: req.session.user_id 
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
 }
});

router.delete('/:id', auth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id 
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({message: 'no comment with that id'})
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;
const User = require('./User');
const BlogPost = require('./BlogPost');
const Likes = require('./Like');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
    foreignKey: 'user_id'
});

BlogPost.belongsTo(User, {
    
    foreignKey: 'user_id'

});

User.belongsToMany(BlogPost, {
    through: Likes,
    as: 'liked_blogposts',
    foreignKey: 'user_id'
});

BlogPost.belongsToMany(User, {
    through: Likes,
    as: 'liked_blogposts',
    foreignKey:'blogpost_id'
});

Likes.belongsTo(User, {
    foreignKey: 'user_id'
});

Likes.belongsTo(BlogPost, {
    foreignKey: 'blogpost_id'
});

User.hasMany(Likes, {
    foreignKey: 'user_id'
});

BlogPost.hasMany(Likes, {
    foreignKey: 'blogpost_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(BlogPost, {
    foreignKey: 'blogpost_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

BlogPost.hasMany(Comment, {
    foreignKey: 'blogpost_id'
})

module.exports = {Likes, User, BlogPost, Comment};
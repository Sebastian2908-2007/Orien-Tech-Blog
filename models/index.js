const User = require('./User');
const BlogPost = require('./BlogPost');
const Like = require('./Like');
const Comment = require('./Comment');

User.hasMany(BlogPost, {
    foreignKey: 'user_id'
});

BlogPost.belongsTo(User, {
    
    foreignKey: 'user_id'

});

User.belongsToMany(BlogPost, {
    through: Like,
    as: 'liked_blogposts',
    foreignKey: 'user_id'
});

BlogPost.belongsToMany(User, {
    through: Like,
    as: 'liked_blogposts',
    foreignKey:'blogpost_id'
});

Like.belongsTo(User, {
    foreignKey: 'user_id'
});

Like.belongsTo(BlogPost, {
    foreignKey: 'blogpost_id'
});

User.hasMany(Like, {
    foreignKey: 'user_id'
});

BlogPost.hasMany(Like, {
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

module.exports = {Like, User, BlogPost, Comment};
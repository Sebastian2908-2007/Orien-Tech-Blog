const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class BlogPost extends Model {
    static upvote(body, models) {
        return models.Likes.create({
            user_id: body.user_id,
            blogpost_id: body.blogpost_id 
        }).then(() => {
            return BlogPost.findOne({
                where: {
                id: body.blogpost_id
                },
                attributes: [
                    'id',
                    'title',
                    'blog_text',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM likes WHERE blogpost.id = likes.blogpost_id) '),
                'like_count'  
                    ]
                ]
            })
        })
    }
}

BlogPost.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    blog_text:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    }
},

    {
sequelize,
freezeTableName: true,
underscored: true,
modelName: 'blogpost'
    }
)

module.exports = BlogPost;

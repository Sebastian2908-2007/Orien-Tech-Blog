const path =require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({helpers});
const cors = require('cors');

const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);


const sess = {
    secret: 'super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db: sequelize
    })
};


const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors())
// session middleware
app.use(session(sess));

// use public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);


// turn on connection to db and server
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, ()=> console.log('Now listening'));
});



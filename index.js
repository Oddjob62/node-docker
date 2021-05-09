const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const redis = require("redis")
const morgan = require('morgan');
let RedisStore = require("connect-redis")(session)
const cors = require('cors')

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
    } = require("./config/config");

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
})

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")

const app = express()

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
        })
        .then(() => console.log("Successfully connected to DB"))
        .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
        });
}

connectWithRetry()

app.use(morgan('tiny'));
app.enable("trust proxy")
app.use(cors({}));
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: false,
        maxAge: 30000
    }
}))


app.use(express.json())
const env_name = process.env.NODE_ENV
app.get("/api/v1/", (req,res) => {
    res.send(`<h2>Hi There! Welcome to the ${env_name} environment</h2>`)
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))
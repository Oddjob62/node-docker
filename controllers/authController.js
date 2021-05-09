const User = require("../models/userModel")

const bcrypt = require("bcryptjs")
exports.signup = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (user) {
            res.status(400).json({
                status: "fail",
                message: "username already exists"
            })
            return
        }
        const hashpassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({ username, password: hashpassword })
        req.session.user = newUser;
        res.status(201).json({
            status: "success",
            data: {
                user: newUser,
            }
        });
    } catch (e) {
        console.error(e)
        res.status(400).json({
            status: "signup fail",
        });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({
                status: "fail",
                message: "incorrect username or password"
            })
            return
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            req.session.user = user;
            res.status(201).json({
                status: "success",
            })
        } else {
            res.status(400).json({
                status: "fail",
                mesasge: "incorrect username or password"
            })
        }
    } catch (e) {
        res.status(400).json({
            status: "login fail",
        });
    }
}

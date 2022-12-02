const User = require('../../models/user')
const Profile = require('../../models/profile')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
    create,
    login,
    checkToken,
    getProfile,
    updateProfile,
}

async function create(req, res) {
    try {
        const user = await User.create(req.body)
        const profile = await Profile.create({user: user._id})
        const token = createJWT(user)
        res.json(token)
    } catch(err) {
        res.status(400).json(err)
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) throw new Error()
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) throw new Error()
        const token = createJWT(user)
        res.json(token)
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function getProfile(req, res) {
    const profile = await Profile.findOne({user: req.user._id})
    res.json(profile)
}

async function updateProfile(req, res) {
    const profile = await Profile.findOne({user: req.user._id})
    await profile.setScore(req.body.newScore, req.body.newCurrency)
    res.json(profile)
}

function checkToken(req, res) {
    console.log('req.user', req.user)
    res.json(req.exp)
}


/*-- Helper Functions --*/
function createJWT(user) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}
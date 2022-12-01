const User = require("../../models/user")
module.exports = {
    getAll
}

async function getAll(req, res){
    const allUsers = await User.find({})
    res.json(allUsers)
}
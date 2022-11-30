const User = require("../../models/user")
module.exports = {
    getAll
}

async function getAll(req, res){
    const allUsers = await User.find({})
    console.log(allUsers)
    res.json(allUsers)
}
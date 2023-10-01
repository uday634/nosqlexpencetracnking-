const getExpences = async (req, where) =>{
    return req.user.getExpences(where);
}

module.exports = {
    getExpences
}
function profile (req, res) {
    res.json({ username: req.user.username, email: req.user.email });
}

module.exports = {
    profile       : profile
};
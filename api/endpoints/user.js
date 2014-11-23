var HttpStatus = require('http-status-codes');

function profile (req, res) {
    var sessionUser = req.user;
    var username = req.params.username;

    //TODO: Get from database the teams this user belongs to.
    // Send these teams along with the request, in an array.

    if (sessionUser.username === username) {
        res.json(HttpStatus.OK, {
            status : 200,
            message : 'Welcome ' + username,
            user        : {
                full_name: sessionUser.full_name,
                username: sessionUser.username,
                email: sessionUser.email,
                access_token: sessionUser.access_token
                //teams: []
            }
        });

    } else {
        // TODO: FInd other user's profile

        res.json(HttpStatus.NOT_IMPLEMENTED, {
            status : 200,
            message : 'Visiting ' + username + '\'s Profile page.',
            user        : { }
        });
    }
}

module.exports = {
    profile       : profile
};
//var base_url = 'http://localhost:8080';
var base_url = 'https://agileapi.herokuapp.com';

module.exports = {
    base_url : base_url,
    facebook : {
        clientID: '1528593364047570',
        clientSecret: '2f4644cc57f2411a5b1ebeb6af8b475a',
        callbackURL: base_url + '/auth/facebook/callback'
    },
    google : {}
};
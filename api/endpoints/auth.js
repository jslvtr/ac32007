function login (req, res){
    res.json({
        status: 200,
        message: 'success!! <- not implemented'
    });
}

function register (req, res){
    res.json({
        status: 200,
        message: 'success!! <- not implemented'
    });
}

function logout (req, res){
    res.json({
        status: 200,
        message: 'success!! <- not implemented'
    });
}

module.exports = {
    login       : login,
    register    : register,
    logout      : logout
};
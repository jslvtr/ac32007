function about (req, res) {
    res.json({
        status: 200,
        version: 0.1,
        authors: [
            'Stuart Douglas',
            'Jose Salvatierra',
            'Yago Carballo'
        ]
    });
}

module.exports = {
    about       : about
};
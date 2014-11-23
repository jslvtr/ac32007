var configDB = require('../config/database.js');
var HttpStatus = require('http-status-codes');
var nodemailer = require('nodemailer');
var hat      = require('hat');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'remonkou@gmail.com',
        pass: '********'
    }
});

function projectInviteTarget (req, res) {
    //console.log("inviting user " + req.params.user + " to project " + req.params.project + " owned by " + req.params.owner);
    var owner       = req.params.owner;
    var project     = req.params.project;
    var user        = req.params.user;
    var sessionUser = req.user;

    if (sessionUser.username == owner) {
        //store the invite in table project_invite
        var username = null;
        var email = null;
        var full_name = null;

        var query       = 'select email, username, full_name from agile_api.users where username = ?;';
        var params      = [ user ];

        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t get user.'
                    });
                } else if (result.rows["0"]!= null) {
                    username    =   result.rows[0].username;
                    email       =   result.rows[0].email;
                    full_name   =   result.rows[0].full_name;
                } else {
                    res.json(HttpStatus.NO_CONTENT, {
                        status: 204,
                        message: 'invite already exists.'
                    });
                }
            }
        );



        var secret = hat();

        query       = 'insert into agile_api.project_invite (project_id, user_id, owner_id, secret) values (?, ?, ?, ?) IF NOT EXISTS;';
        params      = [ project, user, owner, secret ];

        configDB.client.execute(query, params, {prepare: true}, function(err, result) {
                if (err) {
                    res.json(HttpStatus.METHOD_FAILURE, {
                        status: 420,
                        message: 'Can\'t create invite.'
                    });
                    console.log(err);
                } else if (result.rows["0"]["[applied]"] === true) {
                    var mailOptions = {
                        from: 'stuart <remonkou@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: user + ' you have been invited!', // Subject line
                        text: 'You have been invited to join ' + owner + "s project " + project + "\n please click to accept http://localhost/user/" + owner + '/project/' + project + '/invite/' + user + '/accept/' + secret, // plaintext body
                        html: 'You have been invited to join ' + owner + "s project " + project + "\n please click to accept http://localhost/user/" + owner + '/project/' + project + '/invite/' + user + '/accept/' + secret // html body
                    };



                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            console.log(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                            res.json(info.response);
                        }
                    });

                } else {
                    res.json(HttpStatus.NO_CONTENT, {
                        status: 204,
                        message: 'Project already exists.'
                    });
                }
            }
        );

    }   else    {
        res.json(HttpStatus.FORBIDDEN , {
            status: 403,
            message: 'Forbidden'
        });
    }
    /*
    var mailOptions = {
        from: 'stuart <remonkou@gmail.com>', // sender address
        to: 'yagocarballo@gmail.com', // list of receivers
        subject: 'Hello Yago ✔', // Subject line
        text: 'This as a message send from nodejs', // plaintext body
        html: '<b>This as a message send from nodejs ✔</b>' // html body
    };



// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
            res.json(info.response);
        }
    });

     */
}

module.exports = {
    projectInviteTarget      :   projectInviteTarget
};
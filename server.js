/**
 * Created by nathaliesicard on 9/12/15.
 */
var koa = require('koa');
var static = require('koa-static');
var gzip = require('koa-gzip');
var router = require('koa-router')();
var bodyParser = require('koa-body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var app = koa();
app.use(gzip());
app.use(static('public'));


app.use(bodyParser());



router.get('/blog', function*(){
    return this.response.redirect('/blog/index.html');
});


var transporter = nodemailer.createTransport(smtpTransport({
    port: 587,
    host: 'smtp.mandrillapp.com',
    auth: {
        user: 'nathalie.sicard@gmail.com',
        pass: process.env.NODEMAILER_PASSWORD
    }
}));



function sendEmail(text) {
    return new Promise(function(resolve, reject) {
        transporter.sendMail({
            from: 'contact@babies.mx', // sender address
            to: 'contacto@babies.mx', // list of receivers
            subject: 'Contacto Babies.MX',
            text: text
        }, function (error, info) {
            if (error) {
                console.error('Got send mail error: ', error);
                reject(error);
            } else {
                console.log('Message sent: ', info.response);
                resolve();
            }
        });
    });
}

router.post('/contact', function*() {
    console.log('Contact us form was run!', this.request.body);

    yield sendEmail('A contact us was submitted with: ' + JSON.stringify(this.request.body));


    this.body = 'Tu mensaje ha sido enviado. Gracias!';
});

app.use(router.routes());


app.use(function *(){
    this.response.status = 404;
    this.body = 'Lo sentimos, no se encontró el archivo. Por favor vuelve a Babies.mx y comienza de nuevo.';
});


var port = process.env.PORT || 5000;

app.listen(port, function() {
    console.log('Listening on port ' + port + ', go to http://localhost:' + port + '/ ');
});
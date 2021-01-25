const path = require('path')
const express = require('express')
const xss = require('xss');
const nodemailer = require('nodemailer')


const emailRouter = express.Router()
const jsonParser = express.json()

const serializeItem = item => ({
    id: item.id,
    folderid: item.folderid,
    name: xss(item.product),
    size: xss(item.size),
    quantity: item.quantity,
})

const serializePurchase = purchase => ({
    id: purchase.id,
    folderid: purchase.folderid,
    name: xss(purchase.cust_name),
    content: xss(purchase.comment),
    date_published: purchase.modified,
    total: purchase.total,
    paymentStatus: purchase.payment_status,
})

const serializeProfile = profile => ({
    id: profile.id,
    folderid: profile.folderid,
    name: xss(profile.cust_name),
    content: xss(profile.comment),
    email: xss(profile.email),
    phone: xss(profile.phone),
    membership: profile.membership,
    er: profile.er,
    modified: profile.modified,
    comment: profile.comment,
})
//modified, email, phone, membership, er, comment:

emailRouter
.route('/send')
.post(jsonParser, (req, res, next) => {
    console.log('attachments');
    console.log(req);
    console.log('2');
    console.log(req.files);
    console.log('in send');
    console.log(req.body);

    // let transporter = nodemailer.createTransport({
    //     sendmail: true,
    //     auth: {
    //         user: 'elijahguerrero97@gmail.com', // generated ethereal user
    //         pass: 'theLordismyshield97', // generated ethereal password
    //       },
      
    // });
    
    // transporter.sendMail({
    //     from: 'elijahguerrero97@gmail.com',
    //     to: 'elijahguerrero97@gmail.com',
    //     subject: 'Node App Test',
    //     text: 'I hope this message gets delivered!'
    // }, (err, info) => {
    //     console.log('email sent or was there an error?');
    //     console.log(err);
    // });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'oilsporvida@gmail.com', // generated ethereal user
            pass: 'Ilovemy4kids*', // generated ethereal password
          },
      
    });


    
    transporter.sendMail({
        from: 'oilsporvida@gmail.com',
        to: 'Oils Por Vida Subscribers <oilsporvida@gmail.com>',
        bcc: req.body.to,
        subject: req.body.subject,
        html: req.body.message,
        attachments: req.body.attachments? req.body.attachments[0]: null,
    }, (err, info) => {
        console.log('email sent or was there an error?');
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email Sent: ', info.response);
        }
    });
});



module.exports = emailRouter;
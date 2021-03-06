const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./notes-service')

const notesRouter = express.Router()
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

notesRouter
    .route('/inventory')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllItems(knexInstance)
        .then(item => {
            res.json(item.map(serializeItem));
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const folderid = req.body.folderId;
        const { name, size, quantity } = req.body;
        const newItem = { product: name, folderid, size, quantity };
        console.log('toshiba');
                    console.log(req.originalUrl);

            for (const [key, value] of Object.entries(newItem)) {
                if (value == null) {
                    console.log(req.body)
                    return res.status(400).json({
                        error: { message: `Missing '${key}' in request body.`}
                    })
                }
            }

            NotesService.insertItem(
                req.app.get('db'),
                newItem
            )
                .then(item => {
                    
                    res
                        .status(201)
                        
                        .location(path.posix.join(req.originalUrl, `/${item.folderid}/${item.id}`))
                        .json(serializeItem(item))
                })
                .catch(next)
        
        
    })

notesRouter
    .route('/purchase')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllPurchases(knexInstance)
        .then(purchase => {
            res.json(purchase.map(serializePurchase));
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const folderid = req.body.folderId;
        const { name, modified, total, content, paymentStatus } = req.body;
        const newPurchase = { cust_name: name, folderid, modified, total, comment: content, payment_status: paymentStatus  }

            for (const [key, value] of Object.entries(newPurchase)) {
                if (value == null) {
                    console.log(req.body)
                    return res.status(400).json({
                        error: { message: `Missing '${key}' in request body.`}
                    })
                }
            }

            NotesService.insertPurchase(
                req.app.get('db'),
                newPurchase
            )
                .then(purchase => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${purchase.id}`))
                        .json(serializePurchase(purchase))
                })
                .catch(next)
        
        
    })

    notesRouter
    .route('/profiles')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllProfiles(knexInstance)
        .then(profile => {
            res.json(profile.map(serializeProfile));
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const folderid = req.body.folderId;
        const { name, modified, email, phone, membership, er, content } = req.body;
        const newProfile = { cust_name: name, folderid, modified, email, phone, membership, er, comment: content  }

            for (const [key, value] of Object.entries(newProfile)) {
                if (value == null) {
                    console.log(req.body)
                    return res.status(400).json({
                        error: { message: `Missing '${key}' in request body.`}
                    })
                }
            }

            NotesService.insertProfile(
                req.app.get('db'),
                newProfile
            )
                .then(profile => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${profile.id}`))
                        .json(serializeProfile(profile))
                })
                .catch(next)
        
        
    })

  notesRouter
        .route('/:note_id')
        // .all((req, res, next) => {
        //     NotesService.getById(
        //         req.app.get('db'),
        //         req.params.note_id
        //     )
        //     .then(note => {
        //         if(!note) {
        //             return res.status(404).json({
        //                 error: { message: `Note doesn't exist` }
        //             })
        //         }
        //         res.note = note // save the article for the next middleware
        //         next() // don't forget to call next so the next middleware happens!
        //     })
        //     .catch(next)
        // })
        // .get((req, res, next) => {
        //     res.json(serializeNote(res.note))
        // })
        .delete((req, res, next) => {
            const data = req.app.get('folder');
            console.log('request body -> ', req.app.get('folder'));
            console.log('dataaaaa', data);
            console.log(typeof(data));
            
            if(parseInt(data) === 1){
                NotesService.deleteItem(
                    req.app.get('db'),
                    req.params.note_id
                )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
            }
            else if(parseInt(data) === 2){
                NotesService.deletePurchase(
                    req.app.get('db'),
                    req.params.note_id
                )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
            }    
            else if(parseInt(data) === 3){
                NotesService.deleteProfile(
                    req.app.get('db'),
                    req.params.note_id
                )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
            }    
        })
        .patch(jsonParser, (req, res, next) => {
            console.log('welcome to patch');
            const noteToUpdate = req.body;
            
            const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                return res.status(400).json({
                    error: {
                        message: `Request body must contain 'name' or 'content'`
                    }
                })
            }
            console.log('what note to update?', noteToUpdate);
            console.log(req.app.get('folder'));

            if (req.app.get('folder') == 1) {
                NotesService.updateInventory(
                    req.app.get('db'),
                    req.params.note_id,
                    noteToUpdate
                )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
            }
            else if (req.app.get('folder') == 2) {
                NotesService.updatePurchases(
                    req.app.get('db'),
                    req.params.note_id,
                    noteToUpdate
                )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
            }
            else if (req.app.get('folder') == 3){
                NotesService.updateProfile(
                    req.app.get('db'),
                    req.params.note_id,
                    noteToUpdate
                )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
            }
            
        })

module.exports = notesRouter
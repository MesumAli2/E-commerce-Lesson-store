        const express = require('express')
        // const bodyParser = require('body-parser')

        // Create an Express.js instance:
        const app = express()

        // config Express.js
        app.use(express.json())
        app.set('port', 3000)
        app.use ((req,res,next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        })

        const MongoClient = require('mongodb').MongoClient;

        var db;
        MongoClient.connect("mongodb+srv://mesum:saif@cluster0.qyb90.mongodb.net/test", (err, client) =>{
            db = client.db('webstore')
        })

        app.get('/', (req, res, next) =>{
            res.send('Select a collection, e.g., /collection/products')

        })


        // get the collection name
        app.param('collectionName', (req, res, next, collectionName) => {
            req.collection = db.collection(collectionName)
            console.log('collection name:', req.collection.collectionName)
            return next()
        })


        app.post('/collection/collectionName', (req, res, next)=>{
            req.collection.insert(req.body, (e, results) =>{
                if(e) return next(e)
                res.send(results.ops)
            })
        })

        const ObjectID = require('mongodb').ObjectID; app.get('/collection/:collectionName/:id', (req, res, next) => {
            req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
                 if (e) return next(e)
            res.send(result)
            }) })
            
            
      app.get('/collection/:collectionName', (req, res, next) => {
        req.collection.find({}).toArray((e, results) => {
            if (e) return next(e)
            res.send(results)
        })
    })

        app.put('/collection/:collectionName/:id', (req, res, next) => {

            req.collection.update(
            
            {_id: new ObjectID(req.params.id)},
            
            {$set: req.body},
            
            {safe: true, multi: false},
            (e, result) => {
            if (e) return next(e)
            res.send(

                result.modifiedCount === 1 ? { msg: "success" } : { msg: "error" });           
             })
            })

            app.delete('/collection/:collectionName/:id', (req, res, next) => {
                 req.collection.deleteOne(
                {_id: ObjectID(req.params.id)}, (e, result) => {
                        if (e) return next(e)
                res.send((result.modifiedCount === 1) ? {msg: 'success'} : {msg: 'error'}) })
                })


 const port = process.env.port || 3000       
app.listen(port, () =>{
    console.log(port)
})
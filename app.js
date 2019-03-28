const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const uri = "mongodb+srv://root:root@nodecrud-4xkdi.mongodb.net/test?retryWrites=true";
const Mongo = require('mongodb');

const client = new MongoClient(uri, {useNewUrlParser: true});

client.connect(err => {
    const db = client.db('test');

    app.listen(3000, () => {
        console.log('servidor rodando na porta 3000');
    });

    app.post('/show', (req, res) => {
        db.collection('data').save(req.body, (err, result) =>{
            if (err) return console.log(err);
            console.log('salvo no banco de dados');
            res.redirect('/show');
        });
    });

    app.get('/', (req, res) => {
        let cursor = db.collection('data').find();
    });

    app.get('/show', (req, res) => {
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err);
            res.render('show.ejs', { data: results })
        });
    });

    app.route('/edit/:id')
    .get((req, res) => {
        var id = req.params.id;
        db.collection('data').find(Mongo.ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err);
            res.render('edit.ejs', { data: result });
        });
    })
    .post((req, res) => {
        var id = req.params.id;
        var name = req.body.name;
        var surname = req.body.surname;
        var idade = req.body.idade;

        db.collection('data').updateOne({_id: Mongo.ObjectId(id)}, {
            $set: {
                name: name,
                surname: surname,
                idade: idade
            }
        }, (err, result) => {
            if (err) return res.send(err);
            res.redirect('/show');
            console.log("Banco atualizado com sucesso");
        })
    });

    app.route('/delete/:id')
    .get((req, res) => {
        var id = req.params.id;
        db.collection('data').deleteOne({_id: Mongo.ObjectId(id)}, (err, result) => {
            if (err) return res.send(500, err);
            console.log("Deletado do banco de dados.");
            res.redirect('/show');
        })
    });
});

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});


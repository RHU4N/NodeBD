const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const bodyParses = require('body-parser');
const Post = require('./models/Post');

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParses.urlencoded({ extended: false }));
app.use(bodyParses.json());

app.use('/public', express.static('./public/css/bootstrap/css'));

//rota para o cadastro
app.get('/cad', function (req, res) {
    res.render('formulario');
});
//fazendo a inserção no banco
app.post('/add', function (req, res) {
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        img: req.body.img
    }).then(function () {
        //redirecionando para home com o barra
        res.redirect('/')
    }).catch(function (erro) {
        res.send('"Houve um erro: ' + erro);
    });
});

app.get('/deletar/:id', function (req, res) {
    Post.destroy({ where: { 'id': req.params.id } }).then(
        function () {
            res.redirect('/');

        }).catch(function (erro) {
            res.send("NUM EXISTE!");

        });

});

app.get('/', function (req, res) {

    Post.findAll().then(function (posts) {

        posts = posts.map((post) => { return post.toJSON() });
        res.render('home', { posts: posts })

    });
});

app.get('/alterar/:id', function (req, res) {
    Post.findAll({ where: { 'id': req.params.id } }).then(function (posts) {
        //var nposts = JSON.parse(JSON.stringify(posts))
        //res.render('home', {posts: nposts})
        posts = posts.map((post) => { return post.toJSON() });
        res.render('alterar', { posts: posts })
    });

});


app.post('/update', function (req, res) {
    Post.update({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        img: req.body.img
    },
        {
            where: { id: req.body.id }
        }).then(function () {
            res.redirect('/');
        }).catch(function (erro) {
            res.send("Está postagem não existe " + erro);
        });
});

app.listen(8081, function () {
    console.log("Servidor Rodando");
});
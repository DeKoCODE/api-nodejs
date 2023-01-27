var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");

var mongoose = require("mongoose");

const uri =
  "mongodb+srv://edinilson:ed2021@cluster0.puysq.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("A conexão com o MongoDB foi realizada com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

var Usuario = require("./modelo/usuario");

var porta = 4000;

var router = express.Router();

app.use(cors());

router.use(function (req, res, next) {
  console.log("Acesso à primeira camada do middleware...");
 
  res.header("Access-Control-Allow-Origin", "*");
  
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  app.use(cors());
  next();
});

app.get("/", (req, res) => {
  res.send("Olá mundo! Esta é a página inicial da nossa aplicação.");
});

router.get("/", function (req, res) {
  res.json({
    message: "Olá mundo! Está é a nossa API desenvolvida em Node.js."
  });
});

router
  .route("/usuarios")

  .post(function (req, res) {
    var usuario = new Usuario();

    usuario.nome = req.body.nome;
    usuario.login = req.body.login;
    usuario.senha = req.body.senha;

    usuario.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Usuário cadastrado com sucesso!" });
    });
  })

  .get(function (req, res) {
    Usuario.find(function (error, usuarios) {
      if (error) res.send(error);
      res.json(usuarios);
    });
  });

router
  .route("/usuarios/:usuario_id")

  .get(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      res.json(usuario);
    });
  })

  .put(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      //A solicitação envia os dados para serem validados pelo esquema 'usuario'
      usuario.nome = req.body.nome;
      usuario.login = req.body.login;
      usuario.senha = req.body.senha;
      usuario.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário atualizado com sucesso!" });
      });
    });
  })

  .delete(function (req, res) {
    Usuario.deleteOne(
      {
        _id: req.params.usuario_id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário excluído com sucesso!" });
      }
    );
  });

app.listen(porta);
console.log("Iniciando a aplicação na porta " + porta);

app.use("/api", router);

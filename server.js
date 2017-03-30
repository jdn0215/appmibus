/*
$ npm mongodb
$ npm mongoose
$ npm install express@4.13.4 -g
*/
/***********************valores*********************/
const errConectClientM= -1;
const errTrans        = -2;
const success         =  0;
const schema          = "prueba";
const url = 'mongodb://heroku_v8gq64z1:qff2h0fa49ql7s4vue9o0imm91@ds129010.mlab.com:29010/heroku_v8gq64z1';
/**************************************************/

/*********************importaciones****************/
const express    = require('express'),
	  bodyParser = require('body-parser'),
	  app        = express(),
      morgan     = require('morgan'),
	  fs         = require('fs'),
	  mongodb    = require('mongodb');
console.log("require's: ok");
/*************************************************/


/*********************inciando el cliente de mongo*/
const MongoClient = mongodb.MongoClient;
const mongoose    = require('mongoose');
mongoose.connect('mongodb://heroku_v8gq64z1:qff2h0fa49ql7s4vue9o0imm91@ds129010.mlab.com:29010/heroku_v8gq64z1');
console.log("mongoClient corriendo en "+url);
/*************************************************/


/****************configuración de app*************/
app.use(express.static('public'));///acceso a los archivos
app.use(morgan('dev'));///logger
app.use(bodyParser.urlencoded({
								limit: "50mb",
								extended: true 
							}));
app.use(bodyParser.json({limit: "50mb"}));
console.log("app configurada");
/**************************************************/



/*************************ruteo*************************/
const port   = process.env.PORT || 8080;
const router = express.Router();
router.use((req, res, next)=>{
	console.log('entrada.');
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


app.set('port', port	)

app.get('/', function(req, res){
  res.json({ mensaje: 'Un ejemplo de nodejs, express y Heroku hola a todos de aplicaciones globales ya podemos morir en paz R.I.P mas cambios vendran! ya no se que hacerle mas...'});
});
/******************************************************/


/***************************acciones****************/
const objectText = result => result.text();

router.get('/', function(req, res) {	
	res.json( { message: 'MI BUS'} );	
});

router.route('/save').post((req,res)=>{
	console.log("save request");
	MongoClient.connect(url,(err, db)=> {
		if(err){
			return console.log("error al conectar con mongoClient"),
				  res.json({mj:errConectClientM});
		}
		console.log('Conecctado!: ', url);
		let collection = db.collection(schema),
		    obj = req.body;
		let nuevaMarca = obj.arg0;
		console.log("Dato para insertar: "+nuevaMarca);
		nuevaMarca = JSON.parse(nuevaMarca);
		if(nuevaMarca._class!== "Marca" || nuevaMarca.usuario=== null){
			console.log("objeto no definido o usuario no especificado");
			return res.json({mj:errTrans});
		}
		
		nuevaMarca.time = new Date();
		
		collection.remove();
		collection.insert(nuevaMarca,(err,result)=>{
			if(err){
				console.log("ERROR AL INSERTAR");
				res.json({mj:errTrans});
			}
			console.log("dato insertado");
			db.close();
			console.log("mongo closed");
			res.json({mj:success});
		});
	});
});

router.route('/load').post((req,res)=>{
	MongoClient.connect(url,(err, db)=> {
		if(err){
			return console.log("error al conectar con mongoClient"),
				   res.json({mj:errConectClientM});
		}
		///obteniendo ubicación del usuario
		let obj = req.body;
		let latitud = JSON.parse(obj.arg0);
		let longitud = JSON.parse(obj.arg1);
		console.log("consultando para: "+latitud+" "+longitud);
		if(isNaN(latitud) || isNaN(longitud)){
			console.log("coordenada inválida");
			return res.json({mj:errTrans});
		}
		////
		let collection = db.collection(schema);
		collection.find(
			{lat:{ $lt:latitud-1, $gte:latitud+1}},
			{lng:{$lt:longitud-1,$gte:longitud+1}},(err,result)=>{
			if(err){
				console.log("error en la db");
				return res.json({mj:errConectClientM});
			}
			console.log(result);
			res.json(result);
		})
	});
});


/****************************iniciando el servidor*/
app.use('/api', router);
app.listen(port);
console.log("server listo");

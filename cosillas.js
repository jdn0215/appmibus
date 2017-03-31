const schema          = "prueba";
const url = 'mongodb://heroku_v8gq64z1:qff2h0fa49ql7s4vue9o0imm91@ds129010.mlab.com:29010/heroku_v8gq64z1';
const  mongodb    = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoose    = require('mongoose');
mongoose.connect('mongodb://heroku_v8gq64z1:qff2h0fa49ql7s4vue9o0imm91@ds129010.mlab.com:29010/heroku_v8gq64z1');
console.log("mongoClient corriendo en "+url);

g=(a)=>{
	MongoClient.connect(url,(err,db)=>{
		let c = db.collection(schema);
		c.remove();
	});
}
g();
console.log("listo");


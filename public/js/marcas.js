class Marca{
	constructor(lat=0,lng=0,origen="highway",destino="hell",estado="",info="",time=new Date(),usuario){
		this.lat     = lat;
		this.lng     = lng;
		this.origen  = origen;
		this.destino = destino;
		this.estado  = estado;
		this.info    = info;
		this.time    = time;
		this.usuario = usuario;
	}
	static from(v){
		return new Marca(v.lat,v.lng,v.origen,v.destino,v.estado,v.info,v.time,v.usuario);
	}
	static to(v){
		return {
			_class :"Marca",
			lat    :v.lat,
			lng    :v.lng,
			origen :v.origen,
			destino:v.destino,
			estado :v.estado,
			info   :v.info,
			time   :v.time,
			usuario:v.usuario
		}
	}
};

const prepararDatosPrueba=(actual)=>{
	let a=actual.position.lat(),
	    b=actual.position.lng();
	marcasObjs[0]=new Marca(a+=0.00020430,b+=0.00042105,"Lagunilla","San Jose","Hay demasiada presa","Bus placa SJB 666");
	marcasObjs[1]=new Marca(a+=0.00060430,b-=0.00000105,"Aurora","Heredia","Acaba de Salir de la terminal");
	marcasObjs[2]=new Marca(a+=0.00100430,b+=0.00051005,"San Jose","Launilla","El chofer va ebrio","Por la Uruca");
}
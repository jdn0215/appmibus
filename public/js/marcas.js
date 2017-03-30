class Marca{
	constructor(lat=0,lng=0,origen="highway",destino="hell",estado="",info="",time=new Date(),usuario,_id=-1){
		this.lat     = lat;
		this.lng     = lng;
		this.origen  = origen;
		this.destino = destino;
		this.estado  = estado;
		this.info    = info;
		this.time    = time;
		this.usuario = usuario;
		this._id=_id;
	}
	static from(v){
		return new Marca(v.lat,v.lng,v.origen,v.destino,v.estado,v.info,v.time,v.usuario,v._id);
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

/***************inicializar***********************/
const initMap=()=>{
	divMapa=document.getElementById("map");
	getSize();//para pantalla completa
	
	if(!navigator.geolocation)
		return fMensaje("Navegador no soporta geolocalización");
	navigator.geolocation.getCurrentPosition(resOk=>{/*callback se logro recuperar la ubicacion*/
		let config = buildConfig(resOk.coords);//objeto de configuracion del mapa
		mapa = new google.maps.Map(divMapa,config);
		initNavigator(resOk);
		//prepararDatosPrueba(current);
		//pintarMarcas(marcasObjs);
		mapa.setCenter(current.position);
		updatePos();
	},resErr=>{
		fMensaje(erroMapaMj+" "+eval("error"+resErr.code),erroMapaTime);
	});
}/************************************************/

/**************Poner marcas************************/
const pintarMarcas=(marcas)=>{
	infoWindows=infoWindows.reduce((a,e)=>(e.close(),[]),[]);
	marcas.forEach(pintarMarca);
	mapa.setCenter(current.position);
}

const pintarMarca=(marca,indice)=>{
	if(!(marca instanceof Marca))
		return;
	infoWindows.push(crearMarca(marca,indice));
}
const crearMarca=(marca,idx)=>{
	let iw = new google.maps.InfoWindow({map:mapa});//creando la marca
	iw.setPosition({ /*ajustando posición*/
			lat:marca.lat,
			lng:marca.lng
		});
	let contenido = marca.origen+" - "+marca.destino;
	iw.setContent("<button class='btn btn-info btIW' id='id"+idx+"'>"+contenido+"</button>");
	
	iw.estado = marca.estado;
	iw.info = marca.info;
	iw.index=idx;
	return iw;
}
/***************config****************/
const buildConfig=(coordenadas)=>{
	return {
		zoom:zoomMap,/***values.js*/
		center:new google.maps.LatLng(
				coordenadas.latitude,
				coordenadas.longitude
			  )/**objeto con las coordenadas*/
	}
}	
/************************************************/

/*********************actualizar pos*********************/
const updatePos=()=>{
	setInterval(()=>{
		navigator.geolocation.getCurrentPosition(resOk=>{
			if(current!==null && current!==undefined){
				let pos= getPosition(resOk);
				if (pos.lat !== current.position.lat()|| 
				    pos.lng !== current.position.lng() ){
					/*initNavigator(resOk,pos);
					mapa.setCenter(pos);*/
				}
			}
		});
	},timeUpdate);
		
}

/**************************************************/



/******************navegador************/
const initNavigator=(position,pos=null)=>{
	current = new google.maps.Marker({map:mapa});
	if(!verificaGeo()) return;
	pos = pos===null ? getPosition(position) : pos; 
	current.setPosition(pos);
    //current.setContent(mensajeUbicacion);
}

const getPosition=(position)=>{
	return {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		}
}
/************************************************/


/***************para pantalla completa (no sirve usar 100%)****************/
const getSize=()=>{
	divMapa.style="width: "+(screen.width)+"px; height: "+(screen.height)+"px;";
}/************************************************/

/***************************errores**********************/
const verificaGeo=()=>{
	if(navigator.geolocation)
		return true;
	handleLocationError(false,current,mapa.getCenter());
	return false;
}
const handleLocationError=(browserHasGeolocation, current, pos)=>{
  current.setPosition(pos);
  current.setContent(browserHasGeolocation ?
                        erroGeo :
                        erroGeoNavegador);
}
/*************************************************************/

/********************manejo de InfoWindow***********************/
const getInfoWindows=()=>  $(".btn-info").toArray();

const eventoBtInfoW=(e)=>{
	console.log("Evento llamado por "+e.target.id);
	let key = e.target.id.split("id")[1];
	let m = marcasObjs[key];
	$("#dataUsuario").html("  "+m.usuario);
	$("#dataOrigen").html("  "+m.origen);
	$("#dataOrigen").addClass("fa fa-crosshairs");
	$("#dataDestino").html("  "+m.destino);
	$("#dataDestino").addClass("fa fa-arrow-right");
	$("#dataHora").html(timeText(m.time));
	$("#dataQueP").html("  "+m.estado);
	$("#dataQueP").addClass("fa fa-bus");
	$("#dataInfo").html("  "+m.info);
	$("#dataInfo").addClass("fa fa-plus");
	$("#data")[0].className="";
}
const timeText=(d)=>{
	let a="";
	let h=d.getHours();
	let m=d.getMinutes();
	a=(h>10?"":"0")+h+":"+(m>10?"":"0")+m;
	return a;
}

const getId=(infoW)=>{
    let texto = infoW.childNodes[1].childNodes[0].childNodes[0].innerHTML; /*salida - lledada (key)*/
	let key = texto.split('(').pop(); /* key)*/
	key = key.split(')')[0]; /*key*/
	return isNaN(key) ? 0 : key;
}

/******************************************************************/
const nuevasMarcas=(args=[])=>{
	if(marcasObjs.length !== args.length){
		marcasObjs = args;
		return true;
	}
	let hubieronCambios = marcasObjs.reduce(
		(a,e,i)=> e._id === args[i]._id ? a : true ,false);
	if(hubieronCambios)
		marcasObjs = args;
	return hubieronCambios;
}

const filtrar=(_a="",_b="")=>{
	if(_a==="" && _b===_a)
		return get();
	get((args)=>{
		let a=args[0],b = args[1]
		a = a || "";
		b = b || ""
		a = convertir(a);
		b = convertir(b);
		marcasObjs.forEach(
			(e,i)=>verificaMarca(e,i,a,b)
		);
	},_a,_b);
}

const verificaMarca=(marca,i,a,b)=>{
	if(!verificar(marca,a,b))
		infoWindows[i].close();
}

const verificar=(marca,a,b)=>{
	if(a==="" && b===a)
		return true;
	if(b==="")
		return convertir(marca.origen).indexOf(a)!==-1;
	if(a==="")
		return convertir(marca.destino).indexOf(b)===-1;
	return convertir(marca.origen).indexOf(a)!==-1 && convertir(marca.destino).indexOf(b)===-1;
}


const convertir=a=> a.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','U').toUpperCase();


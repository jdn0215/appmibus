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
	
	iw.setContent("<button class='btn btn-info' id='id"+idx+"'>"+contenido+"</button>");
	iw.estado = marca.estado;
	iw.info = marca.info;
	iw.index=idx;
	mapa.setCenter(current.position);
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
const eventoInfoWindows=()=>{
	let arr = getInfoWindows();
	arr.forEach(e=>{
		let key = e.id.split("id")[1];
		let marca = marcasObjs[key];
		e.setAttribute("id","id"+key);
		e.setAttribute("data-toggle","popover");
		$("#id"+key).click(()=>{
			let m = marcasObjs[key];
			$("#dataUsuario")[0].innerHTML= ("  "+m.usuario);
			$("#dataOrigen")[0].innerHTML=("  "+m.origen);
			$("#dataDestino")[0].innerHTML=("  "+m.destino);
			$("#dataHora")[0].innerHTML=(timeText(m.time));
			$("#dataQueP")[0].innerHTML=("  "+m.estado);
			$("#dataInfo")[0].innerHTML=("  "+m.info);
			$("#data")[0].className="";
		});
	});
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




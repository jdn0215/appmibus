/*************Habilitar los callback de los popover******************/
let popOverCallBack = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  popOverCallBack.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
}
var aux=true;
var aux2=false;
var aux3=false;
/******************************************************/

const init=()=>{
	addPopOver();
	$("#"+botonBuscar).click(()=>popOverBuscar());
	$("#dataX").click(()=>$("#data")[0].className="noVisible");
	$("#refresh").click(e=>get());
	$("#ubicame").click(e=>mapa.setCenter(current.position));
	initMap();
	get();
	addLogOut();
};

const buscaMarcas=()=>{
	proxy.proxy("load",res=>{
		if(Array.isArray(res)){
			if(nuevasMarcas(res)){
				aux=true;//da el paso para que se pinten las marcas nuevas
			}
		}else{
			let r = res.mj;
			fMensaje( r===errConectClientM ? mj_Add_ERR_DB
				:     r===errTrans         ? mj_Add_ERR_SR
				:                            mj_Add_ERR_UNK
				);
		}	
	},current.position.lat(),current.position.lng());
}


const addLogOut=()=>{
	var intervarl=setInterval(
		()=>{
			try{
				let logoutB = $("#logout")[0];
				$("#panel")[0].appendChild(logoutB);
				clearInterval(intervarl);
			}catch(e){}
		},
		500
	);
}


const addPopOver=()=>{
	$("#"+botonAdd)[0].setAttribute("data-content",forms.formAdd);
	$("#"+botonAdd)[0].setAttribute("data-toggle","popover");
	$("#"+botonAdd)[0].setAttribute("title","<strong>Añadir un registro</strong>");
	$("#"+botonAdd)[0].setAttribute("data-placement","top");
	$("#"+botonAdd)[0].setAttribute("data-trigger","click");
	$("#"+botonAdd).popover({
		callback:()=>{initEventsAdd();},
		html:true
	});
}


const popOverBuscar=()=>{
	$("#"+botonBuscar)[0].setAttribute("data-content",forms.formSea);
	$("#"+botonBuscar)[0].setAttribute("data-toggle","popover");
	$("#"+botonBuscar)[0].setAttribute("title","<strong>Buscar un registro</strong>");
	$("#"+botonBuscar)[0].setAttribute("data-placement","top");
	$("#"+botonBuscar)[0].setAttribute("data-trigger","click");
	$("#"+botonBuscar).popover({
		callback:()=>{initEventsSea();},
		html:true
	});
}

const initEventsAdd=()=>{
	$("#addAdd").click(()=>addReporte());
	$("#addCancel").click(()=> $("#"+botonAdd)[0].click());
	$("#addOrigen").focus(()=>window.scrollTo(0, 0));
	$("#addDestion").focus(()=>window.scrollTo(0, 0));
	$("#addQuePasa").focus(()=>window.scrollTo(0, 0));
	$("#addExtra").focus(()=>window.scrollTo(0, 0));
};

const initEventsSea=()=>{
	$("#seaSea").click(()=>seaReporte());
	$("#seaCancel").click(()=> $("#"+botonBuscar)[0].click());
	$("#seaOrigen").focus(()=>window.scrollTo(0, 0));
	$("#seaDestion").focus(()=>window.scrollTo(0, 0));
};

const addReporte=()=>{
	let reporte = createReporte();
	if(reporte === false ) return;
	proxy.proxy('save',res=>{
		let r = res.mj;
		fMensaje(     r===success          ? mj_Add_succes
				:     r===errConectClientM ? mj_Add_ERR_DB
				:     r===errTrans         ? mj_Add_ERR_SR
				:                            mj_Add_ERR_UNK
				);
	},reporte);
	marcasObjs.push(reporte);
	aux = true;
	aux2 = true;
	$("#addCancel")[0].click();
};

const seaReporte=()=>{
	let reporte = createSeaReporte();
	if(reporte === false ) return;
	proxy.proxy('save',res=>{
		let r = res.mj;
		fMensaje(     r===success          ? mj_Add_succes
				:     r===errConectClientM ? mj_Add_ERR_DB
				:     r===errTrans         ? mj_Add_ERR_SR
				:                            mj_Add_ERR_UNK
				);
	},reporte);
	marcasObjs.push(reporte);
	aux = true;
	aux2 = true;
	$("#seaCancel")[0].click();
};


///////////////////////***creacíon del reporte****************////////////////////
const createReporte=()=>
	validar()?
	new Marca(
		current.position.lat(),
		current.position.lng(),
		$("#addOrigen").val(),
		$("#addDestion").val(),
		$("#addQuePasa").val(),
		$("#addExtra").val(),
		null,
		localStorage.getItem(USER_NAME)
	):false;
	
const createSeaReporte=()=>
	validarSea()?
	new Marca(
		current.position.lat(),
		current.position.lng(),
		$("#seaOrigen").val(),
		$("#SeaDestion").val(),
		null,
		localStorage.getItem(USER_NAME)
	):false;
	
const validar=()=>{
	let inputs=["addOrigen","addDestion","addQuePasa"];
	let result = true;
	inputs.forEach(e=>{
		if($("#"+e).val()===""){
			result = false;
			changeColorBorder(e);
		}else changeColorBorder(e,true);
	});
	return result;
}	

const validarSea=()=>{
	let inputs=["seaOrigen","seaDestion"];
	let result = true;
	inputs.forEach(e=>{
		if($("#"+e).val()===""){
			result = false;
			changeColorBorder(e);
		}else changeColorBorder(e,true);
	});
	return result;
}	

	
const changeColorBorder=(id,state=false)=> $("#"+id)[0].style=state?"":"border:medium double red;";
////////////////////////////////////////////////////////////////////////////////////


	
const fMensaje=(texto,delay=7000)=>{
	$("#"+mensajetxt)[0].innerHTML=texto;
	$("#"+mensaje).show("slow","swing",()=>
		$("#"+mensaje).hide(delay)
	);

//	$("#"+mensaje).fadeOut("slow");
}
const get=()=>{
	aux = true;
	aux2 = false;
	aux3 = false;
	var interval = setInterval(()=>{
		if(current !== null && current !== undefined){ //evitar que haga feo hasta que todo este listo
			if(aux){
				buscaMarcas();
				aux=false;
				aux=false;
				pintarMarcas(marcasObjs);
				aux2=true;//Da paso para agregar eventos a las marcas
			}else if(aux2){
				let iwa = document.getElementsByClassName('btIW');
				for (let i = 0; i < iwa.length; i++) {
					aux2=false;
					aux3=true;//da paso a que se centre el mapa
					iwa[i].addEventListener('click', e=>{
						eventoBtInfoW(e);
					}, false);
				}		
			}else if(aux3){
				mapa.setCenter(current.position);
				aux3=false;
				clearInterval(interval);
			}
		}
	},timeUpdate);	
}
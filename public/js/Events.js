/*************Habilitar los callback de los popover******************/
let popOverCallBack = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  popOverCallBack.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
}
var aux=false;
var aux2=false;
/******************************************************/

const init=()=>{
	$("#"+botonAdd)[0].setAttribute("data-content",forms.formAdd);
	$("#"+botonAdd).click(()=>popOverAdd());
	$("#"+botonBuscar).click(()=>popOverBuscar());
	initMap();
	setInterval(()=>{
		if(current !== null && current !== undefined){ //evitar que haga feo hasta que todo este listo
			buscaMarcas();
			if(aux){
				aux=false;
				pintarMarcas(marcasObjs);
				aux2=true;//Da paso para agregar eventos a las marcas
			}else if(aux2){
				eventoInfoWindows();
				mapa.setCenter(current.position);
				aux2=false;
			}
		}
	},timeUpdate);
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


const popOverAdd=()=>{
	$("#"+botonAdd).popover({
		html:true,
		placement:'top',
		callback:()=>{initEventsAdd();}
	});
};

const popOverBuscar=()=>{
	fMensaje("TODO");
}

const initEventsAdd=()=>{
	$("#label").innerHTML = 'purebsjd';
	$("#h5").innerHTML = 'purebsjd';
	$("#addAdd").click(()=>addReporte());
	$("#addCancel").click(()=> $("#"+botonAdd)[0].click());
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

	
const changeColorBorder=(id,state=false)=> $("#"+id)[0].style=state?"":"border:medium double red;";
////////////////////////////////////////////////////////////////////////////////////


	
const fMensaje=(texto,delay=7000)=>{
	$("#"+mensajetxt)[0].innerHTML=texto;
	$("#"+mensaje).show("slow","swing",()=>
		$("#"+mensaje).hide(delay)
	);

//	$("#"+mensaje).fadeOut("slow");
}




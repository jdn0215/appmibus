/*************Habilitar los callback de los popover******************/
let popOverCallBack = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  popOverCallBack.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
}
var aux=true;
var aux2=true;
/******************************************************/

const init=()=>{
	$("#"+botonAdd)[0].setAttribute("data-content",forms.formAdd);
	$("#"+botonAdd).click(()=>popOverAdd());
	$("#"+botonAdd)[0].click();
	$("#"+botonBuscar).click(()=>popOverBuscar());
	let logoutB = $("#logout")[0];
	logoutB.className+=" rojo";
	$("#panel")[0].appendChild(logoutB);
	initMap();
	setInterval(()=>{
		if(current !== null && current !== undefined){ //evitar que haga feo hasta que todo este listo
			prepararDatosPrueba(current);
			if(aux){
				aux=false;
				pintarMarcas(marcasObjs);
			}else if(aux2){
				eventoInfoWindows();
				aux2=false;
			}
		}
	},timeUpdate);
};




const popOverAdd=()=>{
	$("#"+botonAdd).popover({
		html:true,
		callback:()=>{initEventsAdd();}
	});
};

const popOverBuscar=()=>{
	fMensaje("TODO");
}

const initEventsAdd=()=>{
	$("#addAdd").click(()=>addReporte());
	$("#addCancel").click(()=> $("#"+botonAdd)[0].click());
};

const addReporte=()=>{
	marcasObjs.push(createReporte());
	aux = true;
	aux2 = true;
	$("#addCancel")[0].click();
};
const createReporte=()=> new Marca(
	current.position.lat(),
	current.position.lng(),
	$("#addOrigen").val(),
	$("#addDestion").val(),
	$("#addQuePasa").val(),
	$("#addExtra").val()
);
	

const fMensaje=(texto,delay=2000)=>{
	$("#"+mensajetxt)[0].innerHTML=texto;
	$("#"+mensaje).show("slow","swing",()=>
		$("#"+mensaje).hide(delay)
	);

//	$("#"+mensaje).fadeOut("slow");
}




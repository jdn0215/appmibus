let divMapa,
	mapa,
	current,
	marcasObjs=[],
	infoWindows=[];
	
const errConectClientM= -1;
const errTrans        = -2;
const success         =  0;

	
const responseStatusMin=200,
	responseStatusMax=300,
	zoomMap=17,
	maxSizeTextArea=100,
	mensaje="mensaje";
	mensajetxt="txtMensaje",
	botonAdd="addRegistro",
	botonBuscar="buscaRegistro",
	mensajeUbicacion="Estas aquí.",
	erroMapaMj="ERROR AL CARGAR EL MAPA!",
	erroMapaTime=20000,
	erroGeo="Error en el servicio de geolocazación.",
	erroGeoNavegador="Error: tu navegador no tiene suporte para geolocazación.",
	error1 = "Permiso denegado, verifique su GPS y que su navegador este actualizado",
	error2 = "Posicon invalida, ha ocurrido algún problema al obtener su posición",
	error3 = "Su posición tardo demasiado en ser obtenida",
	timeUpdate=500,
	precisionGeo=9,
	mj_Add_succes="El reporte se ha creado con éxtio",
	mj_Add_ERR_DB="Ha ocurrido un problema con la base de datos, por favor intente de nuevo",
	mj_Add_ERR_SR="Ha ocurrido un problema con la conexión al servidor, verifique la conexión o intente recargar la página",
	mj_Add_ERR_UNK="Ha ocurrido un error desconocido, intentelo nuevamente";
	
	
	
	
const forms={	
	formAdd:`
	<div id="addReporte">
		<label for="addOrigen">
			Origen del bus
			<input id="addOrigen"></input>
		</label><br/>

		<label for="addDestion">
			Destino del bus
			<input id="addDestion"></input>
		</label><br/>

		<label for="addQuePasa">
			¿Qué pasa con el bus?
			<input id="addQuePasa"></input>
		</label><br/>

		<label for="addExtra">
			Información extra del bus
			<textarea id="addExtra"
					  rows="3"
					  cols="25"
			></textarea>
		</label><br/>
		<button id="addAdd" class="botonPanel">Reportar</button>
		<button id="addCancel" class="botonPanel">Cancelar</button>
	</div>
	`
};
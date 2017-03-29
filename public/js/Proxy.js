class $Proxy{
    constructor(){
        
    };
	proxy(accion="-",callBack,...ars){
		let AJAX_req=new XMLHttpRequest();
		let url = "api/"+ accion;
		AJAX_req.open("POST",url,true);
        AJAX_req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		AJAX_req.onreadystatechange = () => {
            if( AJAX_req.readyState === 4 && AJAX_req.status === 200 ){
                let jsonText=AJAX_req.responseText;
                let status = JSON.parse( jsonText,this.revive );
                callBack(status);
            }
        };
		let prms = this._package(ars);
		AJAX_req.send(prms);
	}
	_package(args=[]){
		return args.reduce(
			(a,e,i)=>(
				a+=((i!==0?"&":"") + ("arg"+i) + "=" + JSON.stringify(e,this.replacer) ))
			,"");
	}
	revive(k,v){
		return (v instanceof Object && v._class === 'Marca') ? Marca.from(v) : v;
	}
	replacer(k,v){
		return (v instanceof Marca) ? Marca.to(v) : v;
	}
	
};
const proxy = new $Proxy();
	
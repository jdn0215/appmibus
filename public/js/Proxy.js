/**
	responseStatusMin,responseStatusMax
*/
const checkStatus=(response)=>{
	if (response.status >= responseStatusMin && response.status < responseStatusMax) 
		return response;
	let error = new Error(response.statusText);
	error.response = response;
	throw error;
}
const objectText = result => result.text();
const parseJson = result => JSON.parse(result);
const result = result => result;
class $Proxy{
    constructor(){
        
    };
    post(accion="",...args){
		fetch(accion,
			{  
			method:"post", 			
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				args.reduce((a,e,i)=>(a['arg'+i]=e,a),{})
			)
		}
		).then(objectText)
		 .then(parseJson)
		 .then(result=>alert(result.mj));
	}
	get(accion="",callBack){
		fetch(accion, {  
			method: 'get'	,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}			
		}).then(checkStatus)
		  .then(objectText)
		  .then(parseJson)
		  .then(result => callBack(result));
	}

};
const proxy = new $Proxy();





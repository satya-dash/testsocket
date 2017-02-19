module.exports ={
	BASEURL: 'http://interview.optumsoft.com',
	SOCKET:null,
	CALLAPI: (url,method,data,callback)=>{
		let httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = ()=>{
			try {
			    if (httpRequest.readyState === XMLHttpRequest.DONE) {
			      	if (httpRequest.status === 200) {
			      		let data = JSON.parse(httpRequest.responseText);
			        	callback('success',data);
			      	} else {
			        	callback('error');
			      	}
			    }
			}
			catch( e ) {
			    console.log('Caught Exception: ' + e.description);
			    callback('error');
			}
		};
		httpRequest.open(method, url, true);
		httpRequest.send(data);
	}
}
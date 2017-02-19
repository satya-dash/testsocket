import Url from './urls';
import dispatcher from "./dispatcher";
import {BASEURL,CALLAPI} from './constants';
let SOCKET=null;
module.exports = {
	_getSensorName : (data)=>{
		CALLAPI(Url.SENSORNAMES,'GET',{},(type,res)=>{
			if(type === 'success'){
				dispatcher.dispatch({
					type: 'SENSORNAMES',
					data: res
				});
			} else {
				dispatcher.dispatch({
					type: 'ERROR_NAME',
					data: []
				});
			}
		});
	},
	_getSensorConfig : (data)=>{
		CALLAPI(Url.SENSORCONFIG,'GET',{},(type,res)=>{
			if(type === 'success'){
				dispatcher.dispatch({
					type: 'SENSORCONFIG',
					data: res
				});
			} else {
				dispatcher.dispatch({
					type: 'ERROR_CONFIG',
					data: {}
				});
			}
		});
	},
	_subscribeSensor: (name)=>{
		if(!SOCKET){
			SOCKET = io(BASEURL);
			SOCKET.on('data',(data)=>{
				if(data){
					dispatcher.dispatch({
						type: 'LIVE_DATA',
						data: data,
						name:name
					});
				}
			})
			SOCKET.emit("subscribe", name);
		} else {
			SOCKET.emit("subscribe", name);
		}
	},
	_unsubscribeSensor: (name)=>{
		if(SOCKET){
			SOCKET.emit("unsubscribe", name);
		}
	}
}
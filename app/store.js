import {EventEmitter} from "events";
import dispatcher from "./dispatcher";
import Moment from 'moment';


class TempStore extends EventEmitter{
	constructor(){
		super();
		this.sensorNames = [];
		this.sensorConfigs = {};
		this.recentTemperature = {}
		this.minuteTemperature = {}

	}

	getSensorNames(){
		return this.sensorNames;
	}

	getSensorConfigs(){
		return this.sensorConfigs;
	}

	getGraphData(name){
		let graphData = this.recentTemperature[name];
		return graphData||[];
	}

	getMinuteGraph(name){
		let minuteData = this.minuteTemperature[name];
		return minuteData||'';
	}


	setSensorNames(names){
		this.sensorNames = names;
		this.emit('change','sensornames');
	}

	setSensorConfigs(configs){
		this.sensorConfigs = configs;
		this.emit('change','sensorconfigs');
	}

	updateStore(data,name){
		if(data.scale === 'recent'){
			if(!this.recentTemperature[name]){
				this.recentTemperature[name] = [];
			}
			if(this.recentTemperature[name].length >= 60){
				this.recentTemperature[name] = this.recentTemperature[name].slice(1);
			}
			if(data.type === 'update'){
				data.key = Moment(new Date(data.key*1000)).format('DD-MM-YYYY h:mm:ss');
				this.recentTemperature[name].push(data);
				this.emit('change','updategraph',name);
			}
		} else {
			this.minuteTemperature[name] = data;
			this.emit('change','minutegraph',name);
		}
	}

	_handleActions(action){
		switch(action.type){
			case 'SENSORNAMES': 	this.setSensorNames(action.data);
									break;
			case 'SENSORCONFIG': 	this.setSensorConfigs(action.data);
									break;
			case 'LIVE_DATA': 		this.updateStore(action.data,action.name);
									break;
			default: return;
		}
	}
}

const tempStore = new TempStore;
dispatcher.register(tempStore._handleActions.bind(tempStore));
export default tempStore;
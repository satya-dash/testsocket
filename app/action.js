import TempUtil from './utils';

export function getSensorName(){
	TempUtil._getSensorName();
}

export function getSensorConfig(){
	TempUtil._getSensorConfig();
}

export function subscribeSensor(name){
	TempUtil._subscribeSensor(name);
}

export function unsubscribeSensor(name){
	TempUtil._unsubscribeSensor(name);
}
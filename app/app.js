import React from 'react';
import {
	LineChart,
	Line, 
	XAxis, 
	YAxis, 
	ReferenceLine, 
	CartesianGrid, 
	Tooltip, 
	Legend
} from 'recharts';

//Stores and actions
import TempStore from './store';
import * as TempAction from './action';

export default class App extends React.Component{
	constructor(){
		super();
		this.state = {
			names: TempStore.getSensorNames(),
			sensorname: '',
			configs: TempStore.getSensorConfigs(),
			apiFetched: false,
			graphData: [
				{name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
				{name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
				{name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
				{name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
				{name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
				{name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
				{name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
			]
		};

		this._storeChanges = this._storeChanges.bind(this);
		this._sensorChange =  this._sensorChange.bind(this);
		this._stopSensorData = this._stopSensorData.bind(this);
	}

	componentWillMount(){
		TempStore.on('change',this._storeChanges);
	}

	componentWillUnmount(){
		TempStore.removeListener('change',this._storeChanges);
	}
	
	componentDidMount(){
		TempAction.getSensorName();
		TempAction.getSensorConfig();
	}


	_storeChanges(type,sName){
		if(type === 'sensornames'){
			this.setState({
				apiFetched: true,
				names: TempStore.getSensorNames()
			});
		} else if(type === 'sensorconfigs'){
			this.setState({
				configs: TempStore.getSensorConfigs()
			});
		} else if(type === 'minutegraph'){
			console.log(TempStore.getMinuteGraph(sName));
		} else if(type === 'updategraph'){
			// console.log(type,sName,TempStore.getGraphData(sName));
			this.setState({
				graphData: TempStore.getGraphData(sName)
			});
		}
	}

	_sensorChange(event){
		TempAction.subscribeSensor(event.target.value);
		this.setState({
			sensorname: event.target.value
		})
	}

	_populateSensors(){
		let {names,apiFetched} = this.state;
		let arr = [<option key="select name" value="">Select sensor</option>];
		if(!apiFetched)
			arr.push(<option key="fetching" value="">Fetching...</option>);
		else
			names.forEach((el,i)=>{
				arr.push(
					<option key={`${el}-{i}`} value={el}>{el}</option>
				);
			});
		return arr;
	}

	_stopSensorData(){
		TempAction.unsubscribeSensor(this.state.sensorname);
	}


	render(){
		let {graphData,names,configs,sensorname} = this.state;
		let tempList = null,refLine = [];
		if(names.length){
			tempList = (
				<select
					onChange={this._sensorChange}
					value={sensorname}
					>
					{this._populateSensors()}
				</select>
			);
		}
		if(sensorname && configs[sensorname]){
			refLine.push(
				<ReferenceLine key={`${sensorname}-min`} y={configs[sensorname].min} label="Min" stroke="red"/>,
				<ReferenceLine key={`${sensorname}-max`} y={configs[sensorname].max} label="Max" stroke="red"/>
			);
		}
		console.log(graphData);
		return (
			<div>
				{tempList}
				{sensorname ? 
					<button onClick={this._stopSensorData}>
						{`Stop ${sensorname}`}
					</button>
					: null
				}
				<LineChart 
					width={600} 
					height={300} 
					data={graphData}
			        margin={{
			        	top: 20, 
			        	right: 50, 
			        	left: 20, 
			        	bottom: 5
			        }}>
				       <XAxis dataKey="key"/>
				       <YAxis/>
				       <CartesianGrid strokeDasharray="3 3"/>
				       <Tooltip/>
				       <Legend />
				       {refLine}
				       <Line type="monotone" dataKey="val" stroke="#8884d8" />
			    </LineChart>
			</div>
		);
	}
}
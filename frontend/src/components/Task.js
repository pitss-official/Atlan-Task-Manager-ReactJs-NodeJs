import React from "react";
import TaskControlButton from "./micro/TaskControlButton";
import axios from 'axios'
import {ProgressBar} from "react-bootstrap";
import {faDownload, faHandHolding, faPause, faPlay, faStop, faTrash} from "@fortawesome/free-solid-svg-icons";
export default class Task extends React.Component {
    url = 'http://localhost:8000';
    state = {
        isValid : true,
        ds:0,
        d:false,
        //state 0 = ready
        //state 1 = paused
        //state 2 = completed
        //state 3 = stopped
        //state 4 = exec
        curr:0,
        ...this.props.details
    }
    delete = ()=>{
        axios.delete(this.url+'/task/'+this.state.id).then(data=>{
            this.setState({isValid:false})
        }).catch(err=>{

        })
    }
    resume = ()=>{
        axios.put(this.url+'/task/'+this.state.id).then(data=>{
            this.setState({state:4})
        }).catch(err=>{

        })
    }
    pause = ()=>{
        axios.post(this.url+'/task/'+this.state.id).then(data=>{

        }).catch(err=>{

        })
    }
    status =()=>{
        axios.get(this.url+'/task/'+this.state.id+'/status').then(res=>{
            this.setState({state:res.data.state,total:res.data.totalLines,curr:res.data.currentLine})
        })
    }
    download = ()=>{
        this.setState({d:true})
        axios.get(this.url+'/task/'+this.state.id).then(res=>{

        }).catch(err=>{

        })
    }
    stopdownload = ()=>{
        axios.get(this.url+'/task/'+this.state.id+'/download/pause').then(res=>{

        }).catch(err=>{

        })
    }
    downloadStatus = ()=>{
        if(this.state.d===true)
        axios.get(this.url+'/task/'+this.state.id+'/download/status').then(res=>{
            console.log(this.state)
            this.setState({ds:res.data.state})
        })
    }
    componentDidMount() {
        setInterval(this.status,500);
        setInterval(this.downloadStatus,1000);
    }
    render = () =>this.state.isValid&&(<div className="row">
        <div className="col-12 col-md-12 col-lg-12">
            <div className="card border-light">
                <div className="card-header task-card-header">
                    <div className="float-left">
                        <div className="card-title"><span className="h5">{this.props.name}</span></div>

                    </div>
                </div>
                <div className="card-body fadeInDown fadeOutUp">
                    <div className="row">
                        <div className="col-lg-2 col-2 col-md-2">
                            <span className="badge">State:</span>
                            <span className="badge badge-primary">{this.state.curr!==this.state.total?this.state.state===1?'Paused':this.state.state===0?'Ready':this.state.state===4?'Executing':'Stopped':'Finished'}</span>
                        </div>
                        <div className="col-lg-10 col-10 col-md-10">
                            <div className="card-header-pills float-right">
                                {this.state.curr===this.state.total && (<TaskControlButton icon={faDownload} clickHandler={this.download} className="btn-outline-success" label="Export"/>)}
                                {this.state.curr===this.state.total && (<TaskControlButton icon={faStop} clickHandler={this.stopdownload} className="btn-outline-danger" label="Stop"/>)}
                                {this.state.curr!==this.state.total && (<TaskControlButton icon={faPlay} clickHandler={this.resume} className="btn-outline-primary" label="Execute"/>)}
                                {this.state.curr!==this.state.total && (<TaskControlButton icon={faPause} clickHandler={this.pause} className="btn-outline-warning" label="Pause"/>)}
                                <TaskControlButton icon={faTrash} clickHandler={this.delete} className="btn-outline-secondary" label="Delete"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    {this.state.d&&(<h3>{this.url+'/download/'+this.state.file_name}</h3>)}
                        <ProgressBar animated={this.state.curr!==this.state.total} variant={this.state.state===1?'warning':'info'} now={parseInt(this.state.curr*100/this.state.total)} />
                </div>
            </div>
        </div>
    </div>)
}

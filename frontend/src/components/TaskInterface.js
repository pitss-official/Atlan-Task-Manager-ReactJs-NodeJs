import React, {Component} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSpinner} from "@fortawesome/free-solid-svg-icons";
import Task from "./Task";
import AddTaskModal from "./micro/AddTaskModal";
export default class TaskInterface extends Component{
    state = {
        loading: true,
        taskCount: -1,
        tasks:[],
        addTaskModal:false
    }
    loadData(){
        axios.get('http://localhost:8000/task')
            .then(res=>{
                this.setState({loading:false,tasks:res.data,taskCount:res.data.length})
            })
            .catch(err=>{
                this.setState({loading:false,tasks:[]})
            })
    }
    componentDidMount() {
        this.loadData()
    }
    componentWillUpdate(nextProps, nextState, nextContext) {
        if(this.state.addTaskModal!==nextState.addTaskModal)this.loadData()
    }
    render() {
        return (
            <div className="container-fluid mt-1">
                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="float-left ">
                            <div className="p-2 mt-2">
                                <span className="h5 p-2 mt-3">Welcome user!</span>
                            </div>
                        </div>
                        <div className="float-right mt-2">
                            <button onClick={() => this.setState({addTaskModal:true})} className="btn nav-bg text-capitalize text-white font-weight-bold">
                                <FontAwesomeIcon icon={faPlus} className="mr-1"/>
                                ADD TASK
                            </button>
                        </div>
                    </div>
                </div>
                <AddTaskModal
                    show={this.state.addTaskModal}
                    onHide={() => this.setState({addTaskModal:false})}
                />
                <hr/>
                {this.state.loading && (<div className="d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin h3"/>
                    <span>&nbsp;&nbsp;Loading</span>
                </div>)}
                {this.state.taskCount===0 && !this.state.loading &&(<div className="d-flex justify-content-center align-items-center">
                    <h6 className="text-info">No tasks available</h6>
                </div>)}
                {this.state.tasks.map(task=> <Task key={task.id} name={task.name} details={task} state="ready" id="555"/>)}
            </div>
        )
    }
}
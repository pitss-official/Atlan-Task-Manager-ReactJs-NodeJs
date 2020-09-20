import React from "react";
import {Modal,Button} from "react-bootstrap";
import axios from "axios";
class AddTaskModal extends React.Component{
    state={
        file:null,
        name:undefined,
    }
    onNameChange = event =>{
        this.setState({name:event.target.value})
    }
    onFileChange = event => {
        this.setState({ file: event.target.files[0] });
    };
    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "file",
            this.state.file,
        );
        formData.append("name",this.state.name)
        console.log(this.state.selectedFile);
        axios.post('http://localhost:8000/task', formData).then(data=>{
            this.props.onHide()
        }).catch(err=>{});
    };
    render=()=> (
        <Modal
            {...this.props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add New Task
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex align-items-center justify-content-center">
                    <form>
                        <label htmlFor="taskName">Enter a unique task name</label>
                        <input value={this.state.name} onChange={this.onNameChange} required={true} name="taskName" className="w-100 text-monospace" type="text" placeholder="Enter task name"/>
                        <br/>
                        <label htmlFor="fileholder">Select a CSV file to upload</label>
                        <input required={true} onChange={this.onFileChange} name="fileholder" className="w-100" type="file" placeholder="Enter task name"/>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="submit" className="btn btn-success" onClick={this.onFileUpload}>Create</button>
                <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default AddTaskModal;
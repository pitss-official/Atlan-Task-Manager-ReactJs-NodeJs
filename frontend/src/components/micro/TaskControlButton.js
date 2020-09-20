import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const TaskControlButton = props =>
    <button className={"btn btn-control p-1 mr-1 "+props.className} title="Stop" onClick={props.clickHandler}>
    <FontAwesomeIcon icon={props.icon}/>
    <br/>
    {props.label}
</button>
export default TaskControlButton
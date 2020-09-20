import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss'
import SiteHeader from "./components/SiteHeader";
import TaskInterface from "./components/TaskInterface";
class App extends React.Component{

    render=()=> (
    <div className="App">
        <SiteHeader/>
      <TaskInterface/>
    </div>
  );
}

export default App;

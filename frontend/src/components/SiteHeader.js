import React from "react";
import logo from '../assets/img/logo.png'
export default class SiteHeader extends React.PureComponent {
    render = () =>
        <div>
            <nav className="navbar navbar-expand-sm nav-bg navbar-dark justify-content-center">
                <img src={logo} alt=""/>
            </nav>
        </div>
}


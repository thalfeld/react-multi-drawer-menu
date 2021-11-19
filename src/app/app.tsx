import React from "react";
import ReactDOM from "react-dom";
import Navigation from "./components/navigation/navigation";
import { links } from "./components/navigation/navigation.stubs";
const stubLinks = links;

const App: React.FC = () => {
    return (
        <div>
            App
            <Navigation links={stubLinks}></Navigation>
        </div>
    );
};

const initReactApp = () => {
    ReactDOM.render(<App />, document.getElementById("app"));
};

export default initReactApp;

import * as React from "react";
import "./App.css";
import {GameComponent} from "./GameComponents";
import {model} from "./Model";
// import DevTools from "mobx-react-devtools";

class App extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="App">
                {/* <DevTools/> */}
                <header className="App-header">
                    <h1 className="App-title">Welcome to ...</h1>
                    <p> Sandbox for React MobX Typescript Quickstart by Marco van Meegen 2019-01-13</p>
                </header>
                <GameComponent model={model}/>
            </div>
        );
    }
}

export default App;

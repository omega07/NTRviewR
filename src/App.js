import React from 'react';
import Editor from './components/Editor.js'
import Home from './components/Home.js'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/"><Home/></Route>
          <Route path="/editor"><Editor/></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './Home';
import MangaDetails from './MangaDetails';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/manga/:id" component={MangaDetails} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, Button } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { getAllImages } from '../actions';
import Home from './Home.js';
import Edit from './Edit.js';
import View from './View.js';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.store = createStore(reducer, applyMiddleware(thunk));
    }

    componentDidMount() {
        this.store.dispatch(getAllImages());
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router>
                    <div className="container">
                        <Link to="/" className="site-title">
                            <PageHeader className="text-center">
                                Photo Uploader <small>Crop, Blur</small>
                            </PageHeader>
                        </Link>
            
                        <Route exact path="/" render={() => {
                            return (
                                <Home />
                            );
                        }} />
                        <Route path="/edit" render={() => {
                            return (
                                <Edit />
                            );
                        }} />
                        <Route path="/:id/view" render={() => {
                            return (
                                <View />
                            );
                        }} />
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
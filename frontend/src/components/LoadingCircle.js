import React from 'react';
import PropTypes from 'prop-types';
import './LoadingCircle.css';

class LoadingCircle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.display) {
            return (<div></div>);
        }

        return (
            <div className="sk-circle-wrapper">
                <div className="sk-circle">
                    <div className="sk-circle1 sk-child"></div>
                    <div className="sk-circle2 sk-child"></div>
                    <div className="sk-circle3 sk-child"></div>
                    <div className="sk-circle4 sk-child"></div>
                    <div className="sk-circle5 sk-child"></div>
                    <div className="sk-circle6 sk-child"></div>
                    <div className="sk-circle7 sk-child"></div>
                    <div className="sk-circle8 sk-child"></div>
                    <div className="sk-circle9 sk-child"></div>
                    <div className="sk-circle10 sk-child"></div>
                    <div className="sk-circle11 sk-child"></div>
                    <div className="sk-circle12 sk-child"></div>
                </div>
            </div>
        );
    }
}

LoadingCircle.propTypes = {
    display: PropTypes.bool.isRequired
};

export default LoadingCircle;
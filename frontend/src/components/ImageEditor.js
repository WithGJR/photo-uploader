import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import _ from 'lodash';
import 'react-image-crop/lib/ReactCrop.scss';
import LoadingCircle from './LoadingCircle.js';
import './ImageEditor.css';
import { refreshImage } from '../common';

class ImageEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: {},
            src: refreshImage(this.props.src)
        };
        _.forEach(['cropChanged', 'cropImageHandler', 'blurImageHandler'], (method) => {
            this[method] = this[method].bind(this);
        });
    }

    componentWillReceiveProps(nextProps) {
        // Refresh image every time the crop or blur processing is finished 
        if (this.props.isProcessing && !nextProps.isProcessing) {
            this.setState({ src: refreshImage(nextProps.src) });
        }
    }

    cropChanged(_, pixelCrop) {
        this.setState({ 
            crop: pixelCrop
        });
    }

    cropImageHandler() {
        if (this.props.isProcessing) {
            return;
        }
        this.props.onCropImage(this.state.crop);
    }

    blurImageHandler() {
        if (this.props.isProcessing) {
            return;
        }
        this.props.onBlurImage(this.state.crop);
    }

    render() {
        if (this.props.src === '') {
            return (<div></div>);
        }

        return (
            <div>
                <ButtonToolbar className="text-center">
                    <Button bsStyle="info" onClick={this.cropImageHandler} className="image-editor-button" bsSize="large">裁切</Button>
                    <Button bsStyle="info" onClick={this.blurImageHandler} className="image-editor-button" bsSize="large">馬賽克</Button>
                </ButtonToolbar>

                <div className="text-center image-section">
                    <LoadingCircle display={this.props.isProcessing} />

                    <ReactCrop
                        onComplete={this.cropChanged}
                        onImageLoaded={this.setDefaultCrop}
                        disabled={this.props.isProcessing}
                        src={this.state.src} />
                </div>
            </div>
        );
    }
}

ImageEditor.propTypes = {
    src: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    onCropImage: PropTypes.func.isRequired,
    onBlurImage: PropTypes.func.isRequired
};

export default ImageEditor;
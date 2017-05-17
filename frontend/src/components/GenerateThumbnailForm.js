import React from 'react';
import PropTypes from 'prop-types';
import { Image, FormGroup, FormControl, ControlLabel, Button, Alert, Tooltip } from 'react-bootstrap';
import Clipboard from 'clipboard';
import _ from 'lodash';
import './GenerateThumbnailForm.css';

class GenerateThumbnailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            width: this.props.maxWidth, 
            height: this.props.maxHeight,
            hasCopiedToClipboard: false
        };
        
        this.clipboard = new Clipboard('#urlInput', {
            text: () => {
                return this.urlInput.value;
            }
        });
        this.clipboard.on('success', (e) => {
            this.urlInput.focus();
            this.urlInput.select();
            this.setState({ hasCopiedToClipboard: true });
            setTimeout(() => {
                this.setState({ hasCopiedToClipboard: false });
            }, 2000);
        });

        _.forEach(['changeWidth', 'changeHeight', 'submit', 'getFullURL'], (method) => {
            this[method] = this[method].bind(this);
        });
    }

    changeWidth(event) {
        this.setState({ width: event.target.value });
        this.props.onInput({ 
            width: event.target.value, 
            height: this.state.height
        });
    }

    changeHeight(event) {
        this.setState({ height: event.target.value });
        this.props.onInput({
            width: this.state.width,
            height: event.target.value
        });
    }

    submit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.width, this.state.height);
    }

    getFullURL(path) {
        return location.protocol + '//' + location.host + path;
    }

    render() {
        const { maxWidth, maxHeight } = this.props;
        const { width, height } = this.state;

        return (
            <div>
                <form onSubmit={this.submit}>
                    <FormGroup 
                        controlId="formInlineName" 
                        validationState={height > maxHeight ? 'error' : null}>
                        <ControlLabel>長度</ControlLabel>
                        {' '}
                        <FormControl 
                            type="text" 
                            onChange={this.changeHeight} 
                            placeholder={`${maxHeight}px`} />
                        <FormControl.Feedback />
                    </FormGroup>
                    {' '}
                    <FormGroup 
                        controlId="formInlineEmail" 
                        validationState={width > maxWidth ? 'error' : null}>

                        <ControlLabel>寬度</ControlLabel>
                        {' '}
                        <FormControl 
                            type="text" 
                            onChange={this.changeWidth} 
                            placeholder={`${maxWidth}px`} />
                        <FormControl.Feedback />
                    </FormGroup>
                    {' '}
                    <Button type="submit">
                        產生縮圖
                    </Button>
                </form>

                <hr/>

                <div>
                    {
                        this.props.src &&
                        <Alert bsStyle="info" className="text-center">複製連結</Alert>
                    }

                    <div className="clipboard-hint">
                        {
                            this.props.src && this.state.hasCopiedToClipboard &&
                            <Tooltip placement="top" className="in" id="tooltip-top">
                                網址已複製
                            </Tooltip>
                        }
                    </div>

                    {
                        this.props.src &&
                        <input
                            id="urlInput"
                            ref={(input) => { this.urlInput = input; }}
                            type="text"
                            className="form-control"
                            value={this.getFullURL(this.props.src)} />
                    }
                </div>

                {
                    this.props.src &&
                    <Image src={this.props.src} className="center-block gallery" responsive />
                }
                
            </div>
        );
    }
}

GenerateThumbnailForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
    maxWidth: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    src: PropTypes.string
};

export default GenerateThumbnailForm;
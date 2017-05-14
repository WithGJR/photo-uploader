import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import 'whatwg-fetch';
import './ImageUpload.css';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.defaultPlaceholder = '貼上圖片的 URL';
        this.state = { 
            url: '',
            placeholder: this.defaultPlaceholder 
        };
        _.forEach(['changeURL', 'uploadImageFromFile', 'uploadImageFromURL', 'hidePlaceholder', 'displayPlaceholder'], (method) => {
            this[method] = this[method].bind(this);
        });
    }

    changeURL(event) {
        this.setState({ url: event.target.value });
    }

    uploadImageFromFile(event) {
        var formData = new FormData();
        formData.append('image', this.imageFile.files[0]);
        this.props.onUploadFromFile(formData);
    }

    uploadImageFromURL(event) {
        if (event.key === 'Enter') {
            this.props.onUploadFromURL(JSON.stringify({ url: this.state.url }));
        }
    }

    hidePlaceholder() {
        this.setState({ placeholder: '' });
    }

    displayPlaceholder() {
        this.setState({ placeholder: this.defaultPlaceholder });
    }

    render() {
        return (
            <div className="text-center">
                <div>
                    <input 
                        type="file" 
                        id="image" 
                        name="image" 
                        className="hidden" 
                        onChange={this.uploadImageFromFile}
                        ref={(input) => { this.imageFile = input; }} />

                    <label className="btn btn-success btn-lg" htmlFor="image">
                        <Glyphicon glyph="picture" />
                        {' 選擇檔案'}
                    </label>
                </div>

                <span className="center-block text-primary h4">或是</span>

                <div>
                    <input className="paste-url-input" 
                        onChange={this.changeURL}
                        onKeyPress={this.uploadImageFromURL} 
                        onFocus={this.hidePlaceholder} 
                        onBlur={this.displayPlaceholder} 
                        value={this.state.url}
                        placeholder={this.state.placeholder} />
                </div>
            </div>
        );
    }
}

ImageUpload.propTypes = {
    onUploadFromFile: PropTypes.func.isRequired,
    onUploadFromURL: PropTypes.func.isRequired
};

export default ImageUpload;
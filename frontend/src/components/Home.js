import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import ImageUpload from './ImageUpload.js';
import ImageList from './ImageList.js';
import { uploadImageFromFile, uploadImageFromURL } from '../actions';
import './Home.css';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!_.isNull(this.props.uploadedImageId)) {
            return (
                <Redirect to="/edit" />
            );
        }

        return (
            <div>
                <ImageUpload
                    onUploadFromFile={this.props.uploadFromFile}
                    onUploadFromURL={this.props.uploadFromURL} />

                {!_.isNull(this.props.errorMessage) &&
                    <div className="alert alert-danger text-center" role="alert">
                        {this.props.errorMessage}
                    </div>
                }

                <div className="gallery">
                    <ImageList />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        uploadedImageId: state.images.get('uploadedImageId'),
        errorMessage: state.images.get('errorMessage')
    };
}

function mapDispatchToProps(dispatch) {
    return {  
        uploadFromFile(form) {
            dispatch(uploadImageFromFile(form));
        },
        uploadFromURL(jsonRequestBody) {
            dispatch(uploadImageFromURL(jsonRequestBody));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
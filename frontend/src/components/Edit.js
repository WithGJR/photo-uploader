import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import ImageEditor from './ImageEditor.js';
import { cropImage, blurImage, publishImage } from '../actions';

class Edit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (_.isNull(this.props.uploadedImageId)) {
            return (
                <Redirect to="/" />
            );
        }

        return (
            <div>
                <ImageEditor
                    src={this.props.url}
                    isProcessing={this.props.isRequesting}
                    onCropImage={this.props.onCropImage}
                    onBlurImage={this.props.onBlurImage} />

                <Button onClick={this.props.onSave} bsStyle="primary" bsSize="large" block disabled={this.props.isRequesting}>
                    <span className="glyphicon glyphicon-edit"></span> {' 完成編輯'}
                </Button>
            </div>
        );
    }
}

function mapStateToProps(state) {
    var currentId = state.images.get('uploadedImageId');
    var currentImage = state.images.get('byId').get(currentId);
    var url = currentImage ? currentImage['url'] : '';

    return {
        uploadedImageId: currentId,
        url: url,
        isRequesting: state.images.get('isRequesting')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onCropImage(crop) {
            dispatch(cropImage(crop));
        },

        onBlurImage(crop) {
            dispatch(blurImage(crop));
        },

        onSave() {
            dispatch(publishImage());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
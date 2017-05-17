import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Image, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import { createThumbnail } from '../actions';
import GenerateThumbnailForm from './GenerateThumbnailForm.js';
import LoadingCircle from './LoadingCircle.js';

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            maxWidth: null, 
            maxHeight: null,
            thumbnailWidth: null,
            thumbnailHeight: null
        };
        this.onImageLoad = this.onImageLoad.bind(this);
        this.onThumbnailSizeChanged = this.onThumbnailSizeChanged.bind(this);
    }

    onImageLoad(event) {
        const { naturalWidth, naturalHeight } = event.target;
        this.setState({
            maxWidth: naturalWidth,
            maxHeight: naturalHeight
        });
    }

    onThumbnailSizeChanged({ width, height }) {
        this.setState({
            thumbnailWidth: _.trim(width),
            thumbnailHeight: _.trim(height)
        });
    }

    render() {
        if (!this.props.appStatesHaveBeenLoaded) {
            return (
                <div className="loading-container">
                    <LoadingCircle display />
                </div>
            );
        }

        const { 
            maxWidth, maxHeight,
            thumbnailWidth, thumbnailHeight
        } = this.state;
        const { image, thumbnails, onSubmit } = this.props;

        const time = moment(image.created_at).fromNow();
        const thumbnail = (
            thumbnails && thumbnails.get(`${thumbnailWidth}x${thumbnailHeight}`)
        ) || null;
        const thumbnailSrc = (thumbnail && thumbnail.url) || null;
        
        return (
            <Row className="show-grid">
                <Col xs={12} md={8}>
                    <Image src={image.url} onLoad={this.onImageLoad} responsive />
                </Col>

                <Col xs={12} md={4}>
                    <h3 className="text-center">
                        <Glyphicon glyph="glyphicon glyphicon-time" />
                        {' ' + time}
                    </h3>

                    <hr/>

                    {
                        maxWidth && maxHeight &&
                        <GenerateThumbnailForm 
                            maxWidth={maxWidth}
                            maxHeight={maxHeight}
                            src={thumbnailSrc}
                            onInput={this.onThumbnailSizeChanged}
                            onSubmit={onSubmit} />
                    }
                </Col>
            </Row>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { match } = ownProps;
    const appStatesHaveBeenLoaded = state.app.get('appStatesHaveBeenLoaded');
    const byId = state.images.get('byId');
    const image = byId.get(match.params.id);
    const thumbnails = state.thumbnails.get('byImageId')
                                       .get(match.params.id);

    return {
        appStatesHaveBeenLoaded,
        image,
        thumbnails
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    const { match } = ownProps;

    return {
        onSubmit(width, height) {
            dispatch(createThumbnail({
                imageId: match.params.id,
                width,
                height
            }));
        }
    };
}

export default withRouter( 
    connect(mapStateToProps, mapDispatchToProps)(View) 
);
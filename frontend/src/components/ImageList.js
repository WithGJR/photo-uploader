import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import { refreshImage } from '../common';

class ImageList extends React.Component {
    render() {
        return (
            <Grid>
                <Row>
                    {this.props.images.map((image, id) => {
                        return (
                            <Col key={id} xs={6} md={3}>
                                <Link to={`/${image.id}/view`}>
                                    <Thumbnail src={refreshImage(image.url)} />
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    var ids = state.images.get('ids');
    var byId = state.images.get('byId');
    var images = ids.map(id => byId.get(id));

    return { images };
}

export default connect(mapStateToProps)(ImageList);
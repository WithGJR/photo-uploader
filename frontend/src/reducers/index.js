import { combineReducers } from 'redux';
import { List, Map } from 'immutable';
import _ from 'lodash';

const thumbnails = (state = Map({
    byImageId: Map()
}), action) => {
    switch (action.type) {
        case 'CREATE_THUMBNAIL_SUCCESS':
            const { width, height } = action.thumbnail;
            var byImageId = state.get('byImageId');
            var thumbnails = byImageId.get(action.imageId) || Map();
            thumbnails = thumbnails.set(`${width}x${height}`, action.thumbnail);
            byImageId = byImageId.set(action.imageId, thumbnails);
            return state.set('byImageId', byImageId);
        default:
            return state;
    }
};

const images = (state = Map({
    isRequesting: false,
    uploadedImageId: null,
    errorMessage: null,
    byId: Map(),
    ids: List()
}), action) => {
    switch (action.type) {
        case 'GET_ALL_IMAGES_SUCCESS':
            var newIds = List( 
                _.map(action.images, image => image.id) 
            );
            var newById = _.reduce(action.images, (byId, image) => {
                return byId.set(image.id, image);
            }, state.get('byId'));

            return state.set('ids', newIds)
                        .set('byId', newById);
        case 'UPLOAD_IMAGE_REQUEST':
            return state.set('isRequesting', true);
        case 'UPLOAD_IMAGE_RECEIVE':
            var newById = state.get('byId').set(action.id, action.image);
            var newIds = state.get('ids').insert(0, action.id);
            
            return state.set('byId', newById)
                        .set('ids', newIds)
                        .set('errorMessage', null);
        case 'UPLOAD_IMAGE_FAILURE':
            return state.set('errorMessage', action.error);
        case 'EDIT_IMAGE_START':
            return state.set('uploadedImageId', action.id);
        case 'CROP_IMAGE_REQUEST':
        case 'BLUR_IMAGE_REQUEST':
        case 'PUBLISH_IMAGE_REQUEST':
            return state.set('isRequesting', true);
        case 'CROP_IMAGE_SUCCESS':
        case 'BLUR_IMAGE_SUCCESS':
            return state.set('isRequesting', false);
        case 'PUBLISH_IMAGE_SUCCESS':
            var newById = state.get('byId').set(action.id, action.image);
            return state.set('isRequesting', false)
                        .set('byId', newById)
                        .set('uploadedImageId', null);
        case 'CLEAR_ERROR_MESSAGE':
            return state.set('errorMessage', null);
        default:
            return state;
    }
};

const reducer = combineReducers({
    thumbnails,
    images
});

export default reducer;
import _ from 'lodash';
import 'whatwg-fetch';
import { checkHTTPStatus } from '../common';

const getAllImagesSuccess = (images) => ({
    type: 'GET_ALL_IMAGES_SUCCESS',
    images
});

export const getAllImages = () => (dispatch, getState) => {
    fetch('/images', { 
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((json) => {
        dispatch(getAllImagesSuccess(json));
    }).catch((error) => {
        console.log(error);
    });
};


const requestUploadImage = () => ({ type: 'UPLOAD_IMAGE_REQUEST' });

const receiveUploadedImage = (id, image) => ({
    type: 'UPLOAD_IMAGE_RECEIVE',
    id,
    image
});

const uploadImageFailed = (error) => ({
    type: 'UPLOAD_IMAGE_FAILURE',
    error
});

const startEditImage = (id) => ({
    type: 'EDIT_IMAGE_START',
    id
});

export const uploadImageFromFile = (form) => (dispatch) => {
    fetch('/images/upload', {
        method: 'POST',
        body: form
    }).then(checkHTTPStatus).then((response) => {
        return response.json();
    }).then((json) => {
        if (!_.isNull(json.error)) {
            dispatch(uploadImageFailed(json.error));   
            return; 
        }
        dispatch(receiveUploadedImage(json.id, json.image));
        dispatch(startEditImage(json.id));
    }).catch((error) => {
        dispatch(uploadImageFailed(error.message));
    });
};

export const uploadImageFromURL = (jsonRequestBody) => (dispatch) => {
    fetch('/images/upload_from_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonRequestBody
    }).then(checkHTTPStatus).then((response) => {
        return response.json();
    }).then((json) => {
        if (!_.isNull(json.error)) {
            dispatch(uploadImageFailed(json.error));
            return;
        }
        dispatch(receiveUploadedImage(json.id, json.image));
        dispatch(startEditImage(json.id));
    }).catch((error) => {
        dispatch(uploadImageFailed(error.message));
    });
};

const requestCropImage = () => ({ type: 'CROP_IMAGE_REQUEST' });
const cropImageSuccess = () => ({ type: 'CROP_IMAGE_SUCCESS' });

export const cropImage = ({ width, height, x, y }) => (dispatch, getState) => {
    dispatch(requestCropImage());
    var id = getState().images.get('uploadedImageId');

    fetch('/images/crop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, width, height, x, y })
    }).then((response) => {
        dispatch(cropImageSuccess());
    }).catch((error) => {
        
    });
};

const requestBlurImage = () => ({ type: 'BLUR_IMAGE_REQUEST' });
const blurImageSuccess = () => ({ type: 'BLUR_IMAGE_SUCCESS' });

export const blurImage = ({ width, height, x, y }) => (dispatch, getState) => {
    dispatch(requestBlurImage());
    var id = getState().images.get('uploadedImageId');

    fetch('/images/blur', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, width, height, x, y })
    }).then((response) => {
        dispatch(blurImageSuccess());
    }).catch((error) => {
        
    });
};

const requestPublishImage = () => ({ type: 'PUBLISH_IMAGE_REQUEST' });
const publishImageSuccess = (id, image) => ({
    type: 'PUBLISH_IMAGE_SUCCESS',
    id,
    image
});

export const publishImage = () => (dispatch, getState) => {
    dispatch(requestPublishImage());
    var id = getState().images.get('uploadedImageId');

    fetch('/images/publish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    }).then((response) => {
        return response.json();
    }).then((json) => {
        dispatch(publishImageSuccess(json.id, json.image));
    }).catch((error) => {
        console.log(error);
    });
};

const createThumbnailSuccess = (imageId, id, thumbnail) => ({
    type: 'CREATE_THUMBNAIL_SUCCESS',
    imageId,
    id,
    thumbnail
});

export const createThumbnail = ({ imageId, width, height }) => (dispatch, getState) => {
    fetch('/images/thumbnail/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: imageId,
            width,
            height
        })
    }).then((response) => {
        return response.json();
    }).then((json) => {
        dispatch(createThumbnailSuccess(imageId, json.id, json.thumbnail));
    }).catch((error) => {
        console.log(error);
    });
};
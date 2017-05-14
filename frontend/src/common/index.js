module.exports.checkHTTPStatus = function(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
};

module.exports.refreshImage = function(url) {
    return url === '' ? url : url + '?' + new Date().getTime();
};
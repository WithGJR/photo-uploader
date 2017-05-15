const path = require('path');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const request = require('request');
const _ = require('lodash');
const uuid4 = require('uuid/v4');
const { Photo, Thumbnail } = require('../models');

function imageExtensionIsValid(extension) {
    return _.reduce(['.jpg', '.jpeg', '.png'], (isValid, validExtension) => {
        return extension === validExtension ? true : isValid;
    }, false);
}

module.exports = {
    async getAll(ctx) {
        var images = await Photo.findAll({
            where: { public: true },
            order: [
                ['created_at', 'DESC']
            ]
        });
        ctx.body = images;
    },

    async upload(ctx) {
        if (!_.has(ctx.request.body.files, 'image')) {
            ctx.throw(400);
        }

        var file = ctx.request.body.files.image;
        var contentType = file.type;

        if (!_.includes(contentType, 'image/')) {
            ctx.body = { error: '請確認您上傳的檔案為圖片' };
            ctx.status = 415;
            return;
        }

        var extension = '.' + contentType.split('/')[1];
        if (!imageExtensionIsValid(extension)) {
            ctx.body = { error: '請確認您上傳的圖片為 jpg 或 png 格式' };
            ctx.status = 415;
            return;
        }
       
        var newFilename = uuid4() + extension;
        var newPath = path.join(__dirname, '../assets/images', newFilename);

        try {
            await new Promise((resolve, reject) => {
                fs.rename(file.path, newPath, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            ctx.throw(500);
        }

        var image = await Photo.create({ filename: newFilename });
        ctx.body = {
            error: null,
            id: image.id,
            image
        };
    }, 

    async downloadFromURL(ctx) {
        var imageURL = ctx.request.body.url;
        var filename;

        try {
            await new Promise((resolve, reject) => {
                request.get(imageURL).on('response', (response) => {
                    if (response.statusCode >= 300) {
                        reject('請確認您輸入的 URL 是否正常');
                        return;
                    }

                    var contentType = response.headers['content-type'];
                    if (!_.includes(contentType, 'image/')) {
                        reject('請確認您輸入的 URL 確實為圖片');
                        return;
                    }

                    var extension = '.' + contentType.split('/')[1];
                    if (!imageExtensionIsValid(extension)) {
                        reject('請確認此 URL 指向的圖片為 jpg 或 png 格式');
                        return;
                    }

                    filename = uuid4() + extension;
                    response.pipe(fs.createWriteStream(`./assets/images/${filename}`));
                    resolve();
                });
            });
        } catch (error) {
            ctx.body = { error };
            ctx.status = 400;
            return;
        }

        var image = await Photo.create({ filename });
        ctx.body = {
            error: null,
            id: image.id,
            image
        };
    },

    async crop(ctx) {
        const { id, width, height, x, y} = ctx.request.body;

        var image = await Photo.findById(id);

        try {
            await new Promise((resolve, reject) => {
                gm(`./assets/images/${image.filename}`)
                .crop(width, height, x, y)
                .write(`./assets/images/${image.filename}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            
        }
        ctx.body = {};
    },

    async blur(ctx) {
        const { id, width, height, x, y } = ctx.request.body;
        var image = await Photo.findById(id);
        var filename = image.filename;

        try {
            await new Promise((resolve, reject) => {
                gm(`./assets/images/${filename}`)
                .crop(width, height, x, y)
                .scale(20, 20)
                .scale(width, height)
                .write(`./assets/images/blur_${filename}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            var tempImagePath = await new Promise((resolve, reject) => {
                gm(`./assets/images/${filename}`)
                .composite(`./assets/images/blur_${filename}`)
                .geometry(`+${x}+${y}`)
                .write(`./assets/images/${filename}`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`./assets/images/blur_${filename}`);
                    }
                });
            });

            fs.unlink(tempImagePath, (err) => { });
        } catch (error) {
            
        }

        ctx.body = {};
    }, 

    async publish(ctx) {
        const { id } = ctx.request.body;
        var image = await Photo.findById(id);
        image = await image.update({ public: true });
        
        ctx.body = { 
            id: image.id,
            image 
        };
    },

    async createThumbnail(ctx) {
        const { id, width, height } = ctx.request.body;
        var image = await Photo.findById(id);

        const { currentWidth, currentHeight } = await new Promise((resolve, reject) => {
            gm(`./assets/images/${image.filename}`)
            .size((err, { width, height }) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        currentWidth: width,
                        currentHeight: height
                    });
                }
            });
        });

        if (width > currentWidth || height > currentHeight) {
            ctx.body = { error: '長度及寬度不可大於原本的那小' };
            ctx.status = 415;
            return;
        }

        var [thumbnail, _] = await Thumbnail.findOrBuild({
            where: { width, height, photo_id: image.id },
            defaults: { width, height, photo_id: image.id }
        });
        
        if (thumbnail.filename) {
            ctx.body = {
                id: thumbnail.id,
                thumbnail
            };
            return;
        };

        const extension = path.extname(image.filename);
        const thumbnailFilename = uuid4() + extension;

        await new Promise((resolve, reject) => {
            gm(`./assets/images/${image.filename}`)
            .resize(width, height)
            .write(`./assets/images/${thumbnailFilename}`, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        thumbnail.set('filename', thumbnailFilename);
        thumbnail = await thumbnail.save();
        ctx.body = {
            id: thumbnail.id,
            thumbnail
        };
    }
};
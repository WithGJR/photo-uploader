const path = require('path');
const Router = require('koa-router');
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const koaBody = require('koa-body');
const app = new Koa();
const router = new Router();

const { images } = require('./controllers');

app.use(koaBody({ 
    multipart: true,
    formLimit: '10mb',
    formidable : {
        uploadDir: path.join(__dirname, 'assets/images')
    }
}));

app.use(
    mount('/assets/images', serve(
        path.resolve(__dirname, 'assets/images')
    ))
);
app.use(
    mount('/', serve(
        path.resolve(__dirname, '../frontend/dist')
    ))
);

router.get('/images', images.getAll);
router.post('/images/upload', images.upload);
router.post('/images/upload_from_url', images.downloadFromURL);
router.post('/images/crop', images.crop);
router.post('/images/blur', images.blur);
router.post('/images/publish', images.publish);
router.post('/images/thumbnail/create', images.createThumbnail);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
console.log('listening on port 3000');
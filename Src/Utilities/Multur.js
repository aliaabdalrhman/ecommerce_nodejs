import multur from 'multer'

function fileUpload() {
    const storage = multur.diskStorage({});
    function fileFilter(req, file, cb) {
        if (['image/jpeg', 'image/png', 'image/gif', 'img/jpj'].includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb('invalid format', false)
        }
    }
    const upload = multur({ fileFilter, storage });
    return upload;
}
export default fileUpload;
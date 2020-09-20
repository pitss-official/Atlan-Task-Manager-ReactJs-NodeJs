var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/tasks');
    },
    filename: (req, file, cb) => {
        console.log(req.body)
        console.log(file);
        var filetype = '';
        if(file.mimetype === 'application/vnd.ms-excel') {
            filetype = 'csv';
        }
        req.saveFileName = `file_${Date.now()}`
        cb(null, req.saveFileName+'.csv');
    }
});
module.exports=multer({storage: storage});
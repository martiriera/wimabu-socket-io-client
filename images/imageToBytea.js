const fs = require('fs');
module.exports = {
    imageToBytea(fileName, type) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, type, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
}

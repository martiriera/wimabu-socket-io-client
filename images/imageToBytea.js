const fs = require('fs');
module.exports = {
    imageToBytea(fileName) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
}

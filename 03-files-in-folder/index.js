const fs = require("fs");
const path = require("path");

const routeSecretFolder = path.join(__dirname, "secret-folder");

fs.promises.readdir(routeSecretFolder, { withFileTypes: true }).then((files) => {
    
    files.forEach((el) => {
        let routEl = path.join(__dirname, "secret-folder", el.name);

        if (el.isFile()) {
            let dataEl = `${path.parse(routEl).name} - ${path.parse(routEl).ext.slice(1)}`;

            fs.stat(routEl, (err, stats) => {
                err || console.log(`${dataEl} - ${stats.size / 1024}kb`);
            });
        }
    })
}
);

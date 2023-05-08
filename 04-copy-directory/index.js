const fs = require("fs");
const path = require("path");
const routefiles = path.join(__dirname, "files");
const routeNewFolder = path.join(__dirname, "files-copy");

fs.mkdir(routeNewFolder, (err) => {});

fs.promises
  .readdir(routeNewFolder, { withFileTypes: true })
  .then((files) =>
    files.forEach((el) => {
      fs.unlink(path.join(__dirname, "files-copy", el.name), (err) => {});
    })
  );

fs.promises.readdir(routefiles, { withFileTypes: true }).then((files) =>
  files.forEach((el) => {
    let routeEl = path.join(__dirname, "files", el.name);
    let routeNewFile = path.join(__dirname, "files-copy", el.name);

    fs.readFile(routeEl, (err, content) => {
      err || fs.writeFile(routeNewFile, content.toString(), (err) => {});
    });
  })
);

const fs = require("fs");
const path = require("path");
const routeStyles = path.join(__dirname, "styles");
const routeProjectDist = path.join(__dirname, "project-dist");
const routeBundleCss = path.join(routeProjectDist, "bundle.css");

fs.writeFile(routeBundleCss, "", (err) => {
  if (err) throw err;
});

fs.promises
  .readdir(routeStyles, { withFileTypes: true })
  .then((files) =>
    files.filter((file) => {
      let roteFile = path.join(__dirname, "styles", file.name);
      let fileExt = path.parse(roteFile).ext.slice(1);
      if (fileExt === "css") return file;
    })
  )
  .then((files) =>
    files.forEach((file) => {
      let roteFile = path.join(__dirname, "styles", file.name);
      fs.readFile(roteFile, (err, content) => {
        err || fs.appendFile(routeBundleCss, `${content.toString()}\n`, (err) => {});
      });
    })
  );

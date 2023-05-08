const fs = require("fs");
const path = require("path");
const routeProjectDist = path.join(__dirname, "project-dist");

async function cleanFolder(folder) {
  let files = [];
  try {
    files = await fs.promises.readdir(folder, { withFileTypes: true });
  } catch (e) {
    return;
  }

  for (const el of files) {
    if (el.isFile()) {
      await fs.promises.unlink(path.join(folder, el.name));
    }

    if (el.isDirectory()) {
      await cleanFolder(path.join(folder, el.name));
    }
  }

  await fs.promises.rmdir(folder);
}

const createAssets = (routeAss, routeNewAss) => {
  fs.mkdir(path.join(routeNewAss), { recursive: true }, () => {
    fs.promises
      .readdir(path.join(routeAss), { withFileTypes: true })
      .then((files) =>
        files.forEach((el) => {
          if (el.isDirectory()) {
            createAssets(
              path.join(routeAss, ".\\", el.name),
              path.join(routeNewAss, ".\\", el.name)
            );
          }

          if (el.isFile()) {
            fs.promises.copyFile(
              path.join(routeAss, ".\\", el.name),
              path.join(routeNewAss, ".\\", el.name)
            );
          }
        })
      );
  });
};

const createStyles = (routeStyles, roteNewStyles) => {
  const style = [];
  const writeStyle = fs.createWriteStream(roteNewStyles, "utf-8");

  fs.promises.readdir(routeStyles, { withFileTypes: true }).then((files) =>
    files.forEach((el) => {
      const routeEl = path.join(routeStyles, "\\", el.name);

      if (el.name.slice(-3) === "css") {
        const readStyle = fs.createReadStream(routeEl, "utf-8");

        readStyle.on("data", (data) => {
          style.push(data);
        });

        readStyle.on("end", () => {
          writeStyle.write(style.flat().join("\n"), "utf-8");
        });
      }
    })
  );
};

async function createHtml(routeTemplateHtml, routeComponents, routeIndexHtml) {
  const writeHtml = fs.createWriteStream(routeIndexHtml, "utf-8");
  const files = await fs.promises.readdir(routeComponents, {
    withFileTypes: true,
  });
  
  const options = {};

  for (const el of files) {
    if (el.name.slice(-4) === "html") {
      const optionName = el.name.slice(0, -5);
      const optionValue = (
        await fs.promises.readFile(path.join(routeComponents, el.name))
      ).toString();
      options[optionName] = optionValue;
    }
  }

  const readTemplate = (
    await fs.promises.readFile(routeTemplateHtml)
  ).toString();
  let res = readTemplate;

  Object.keys(options).forEach((key) => {
    res = res.replaceAll(`{{${key}}}`, options[key]);
  });

  writeHtml.write(res, "utf-8");
}

async function mergeHtml() {
  await cleanFolder(path.join(__dirname, "project-dist"));
  await fs.promises.mkdir(path.join(__dirname, "project-dist"), {
    recursive: true,
  });

  createAssets(
    path.join(__dirname, ".\\", "assets"),
    path.join(routeProjectDist, ".\\", "assets")
  );

  createStyles(
    path.join(__dirname, "styles"),
    path.join(__dirname, "project-dist\\style.css")
  );

  await createHtml(
    path.join(__dirname, "template.html"),
    path.join(__dirname, "components"),
    path.join(routeProjectDist, "index.html")
  );
}

mergeHtml();

const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const destFolderPath = path.join(__dirname, 'project-dist');
const destAssetsPath = path.join(destFolderPath, 'assets');

async function buildPage() {
  const templatePath = path.join(__dirname, 'template.html');

  async function isPathExists(path) {
    try {
      await fsPromises.stat(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  if (await isPathExists(destFolderPath)) {
    await fsPromises.rm(destFolderPath, {
      recursive: true,
    });
  }

  const destFolder = await fsPromises.mkdir(destFolderPath, {
    recursive: true,
  });

  const destIndexPath = path.join(destFolderPath, 'index.html');
  const writeStream = fs.createWriteStream(destIndexPath);

  const readStream = fs.createReadStream(templatePath, 'utf-8');
  readStream.on('data', async (chunk) => {
    writeStream.write(await replaceTags(chunk));
  });

  mergeStyles();
  copyDir(assetsPath, destAssetsPath);
}

async function replaceTags(str) {
  let html = str;

  const componentsNames = await getComponentsNames();
  for (let name of componentsNames) {
    const componentContent = await getComponentContent(name);

    html = html.replaceAll(`{{${name}}}`, `\n${componentContent}`);
  }

  return html;
}

async function getComponentsNames() {
  const components = await fsPromises.readdir(componentsPath);

  const componentsNames = components.map(
    (component) => component.split('.')[0],
  );

  return componentsNames;
}

async function getComponentContent(component) {
  return new Promise((res, rej) => {
    let content = '';

    const componentContentPath = path.join(componentsPath, `${component}.html`);
    const stream = fs.createReadStream(componentContentPath, 'utf-8');

    stream.on('data', (chunk) => {
      content += chunk;
    });

    stream.on('end', () => res(content));
    stream.on('error', rej);
  });

  // let content = '';

  // const componentContentPath = path.join(componentsPath, `${component}.html`);
  // const stream = fs.createReadStream(componentContentPath, 'utf-8');
  // stream.on('data', (chunk) => {
  //   content += chunk;
  // });

  // return content;
}

async function mergeStyles() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  const stylesFolder = await fsPromises.readdir(stylesFolderPath);
  const destFilePath = path.join(__dirname, 'project-dist', 'style.css');

  const writeStream = fs.createWriteStream(destFilePath);

  for (let fileName of stylesFolder) {
    const pathToFile = path.join(stylesFolderPath, fileName);

    if (path.extname(pathToFile) === '.css') {
      const readStream = fs.createReadStream(pathToFile, 'utf-8');
      readStream.on('data', (chunk) =>
        writeStream.write(`\n${chunk.toString()}`),
      );
    }
  }
}

async function copyDir(initFolderPath, copyFolderPath) {
  const copyFolder = await fsPromises.mkdir(copyFolderPath, {
    recursive: true,
  });

  try {
    const entries = await fsPromises.readdir(initFolderPath, {
      withFileTypes: true,
    });

    for (let entry of entries) {
      if (entry.isFile()) {
        const srcFile = path.join(initFolderPath, entry.name);
        const destFile = path.join(copyFolderPath, entry.name);
        await fsPromises.copyFile(srcFile, destFile);
      } else if (entry.isDirectory()) {
        const srcPath = path.join(initFolderPath, entry.name);
        const destPath = path.join(copyFolderPath, entry.name);
        copyDir(srcPath, destPath);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

buildPage();

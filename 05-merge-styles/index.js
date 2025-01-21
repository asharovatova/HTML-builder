const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  const stylesFolder = await fsPromises.readdir(stylesFolderPath);
  const destFolderPath = path.join(__dirname, 'project-dist');
  const destFolder = await fsPromises.readdir(destFolderPath);
  const destFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

  if (destFolder.length > 1) {
    await fsPromises.rm(destFilePath);
  }

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

mergeStyles();

const path = require('path');
const { readdir, stat } = require('fs/promises');

const pathToSecretFolder = path.join(__dirname, 'secret-folder');

async function showFilesInfo() {
  try {
    const entries = await readdir(pathToSecretFolder, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const pathToFile = path.join(__dirname, 'secret-folder', entry.name);

        const fileName = entry.name.split('.')[0];

        const fileExtension = path.extname(pathToFile).slice(1);

        let file = await stat(pathToFile);
        let fileSize = (file.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}
showFilesInfo();

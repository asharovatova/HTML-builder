const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir() {
  const pathToInitialFolder = path.join(__dirname, 'files');
  const pathToCopyFolder = path.join(__dirname, 'files-copy');

  // const copyFolder = await fsPromises.mkdir(pathToCopyFolder, {
  //   recursive: true,
  // });

  try {
    const copyFolderEntries = await fsPromises.rm(pathToCopyFolder, {
      recursive: true,
    });

    const copyFolder = await fsPromises.mkdir(pathToCopyFolder, {
      recursive: true,
    });

    const entries = await fsPromises
      .readdir(pathToInitialFolder)
      .then((files) => {
        files.forEach(async (fileName) => {
          const srcFile = path.join(pathToInitialFolder, fileName);

          const destFile = path.join(pathToCopyFolder, fileName);

          await fsPromises.copyFile(srcFile, destFile);
        });
      });

    // ------------

    // const copyFolderEntries = await fsPromises.readdir(pathToCopyFolder);

    // for (let fileName of copyFolderEntries) {
    //   const pathToFile = path.join(__dirname, 'files-copy', fileName);
    //   await fsPromises.rm(pathToFile);
    // }

    // const entries = await fsPromises.readdir(pathToInitialFolder);

    // for (let fileName of entries) {
    //   const srcFile = path.join(pathToInitialFolder, fileName);
    //   const destFile = path.join(pathToCopyFolder, fileName);
    //   await fsPromises.copyFile(srcFile, destFile);
    // }
  } catch (error) {
    console.log(error.message);
  }
}

copyDir();

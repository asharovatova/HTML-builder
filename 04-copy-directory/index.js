const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function copyDir() {
  const pathToInitialFolder = path.join(__dirname, 'files');
  const pathToCopyFolder = path.join(__dirname, 'files-copy');

  const copyFolder = await fsPromises.mkdir(pathToCopyFolder, {
    recursive: true,
  });

  try {
    const copyFolderEntries = await fsPromises
      .readdir(pathToCopyFolder)
      .then((entries) => {
        console.log('copy', entries);
        entries.forEach(async (fileName) => {
          const pathToFile = path.join(__dirname, 'files-copy', fileName);
          await fsPromises.rm(pathToFile);
          console.log('removed');
        });
      });

    const entries = await fsPromises
      .readdir(pathToInitialFolder)
      .then((entries) => {
        console.log('orig', entries);
        entries.forEach((fileName) => {
          const srcFile = path.join(pathToInitialFolder, fileName);
          const destFile = path.join(pathToCopyFolder, fileName);
          fsPromises.copyFile(srcFile, destFile);
          console.log('added');
        });
      });

    // ------------

    // const copyFolderEntries = await fsPromises.readdir(pathToCopyFolder);
    // copyFolderEntries.forEach(async (fileName) => {
    //   const pathToFile = path.join(__dirname, 'files-copy', fileName);
    //   await fsPromises.rm(pathToFile);
    //   console.log('removed');
    // });

    // const entries = fs.readdir(pathToInitialFolder);
    // entries.forEach((fileName) => {
    //   const srcFile = path.join(pathToInitialFolder, fileName);
    //   const destFile = path.join(pathToCopyFolder, fileName);
    //   fsPromises.copyFile(srcFile, destFile);
    //   console.log('added');
    // });

    // ------------

    // const copyFolderEntries = fs.readdir(pathToCopyFolder, (err, files) => {
    //   console.log('copy', files);
    //   files.forEach(async (fileName) => {
    //     const pathToFile = path.join(__dirname, 'files-copy', fileName);
    //     await fsPromises.rm(pathToFile);
    //     console.log('removed');
    //   });
    // });

    // const entries = fs.readdir(pathToInitialFolder, (err, files) => {
    //   console.log('orig', files);
    //   files.forEach((fileName) => {
    //     const srcFile = path.join(pathToInitialFolder, fileName);
    //     const destFile = path.join(pathToCopyFolder, fileName);
    //     fsPromises.copyFile(srcFile, destFile);
    //     console.log('added');
    //   });
    // });
  } catch (error) {
    console.log(error.message);
  }
}

copyDir();

const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const dirPathDefault = path.join(__dirname, 'files');
const dirPathClone = path.join(__dirname, 'files-copy');

async function CloneDir(dirFrom, dirTo) {
  try {
    await fsPromises.rm(dirTo, { force: true, recursive: true });
    fs.mkdir(dirTo, { recursive: true }, (err) => {
      if (err) return err;
    });
    const files = await fsPromises.readdir(dirFrom, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dirFrom, file.name);
      const FilePathClone = path.join(dirTo, file.name);
      if (file.isFile()) {
        const inputStream = fs.createReadStream(filePath);
        const outputStream = fs.createWriteStream(FilePathClone);

        inputStream.pipe(outputStream);
        inputStream.on('end', () => console.log(`Файл ${file.name} скопирован`));
        inputStream.on('error', err => err);
      } else if (file.isDirectory()) {
        CloneDir(filePath, FilePathClone);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

CloneDir(dirPathDefault, dirPathClone);

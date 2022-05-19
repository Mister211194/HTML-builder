const fsPromises = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const dirFile = path.join(__dirname, 'secret-folder', file.name);
        const fileType = path.extname(file.name).slice(1);
        const fileName = path.basename(dirFile, `.${fileType}`);
        const fileSize = (await fsPromises.stat(dirFile)).size;
        const fileSizeToKb = (fileSize / 1024);
        console.log(`${fileName} - ${fileType} - ${fileSizeToKb}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

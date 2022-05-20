const fs = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function readStyles(folderFrom, bundleFolder) {
    const data = [];
    const files = await fs.promises.readdir(folderFrom, { withFileTypes: true });
    for (let file of files) {
        const filePath = path.join(folderFrom, file.name);
        const fileType = path.extname(file.name);
        if (fileType === '.css') {
            const readableStream = fs.createReadStream(filePath, 'utf-8');
            let res = '';
            readableStream.on('data', chunk => res += chunk);
            readableStream.on('end', () => {
                data.push(res);
                fs.promises.writeFile(bundleFolder, data);
            });
            readableStream.on('error', error => console.log('Error', error.message));
        }
    }
}

readStyles(stylesFolderPath, bundlePath);
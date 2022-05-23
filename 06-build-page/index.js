const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const sltylesFolderPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const buildFolderPath = path.join(__dirname, 'project-dist');
const buildHtmlFilePath = path.join(buildFolderPath, 'index.html');
const buildSlylesFilePath = path.join(buildFolderPath, 'style.css');
const buildAssetsPath = path.join(buildFolderPath, 'assets');

async function createBuildDir() {
    fs.mkdir(buildFolderPath, { recursive: true }, (err) => {
        if (err)
            return err;
    });
}

async function handleReplaceContent() {
    const tempalatePath = path.join(__dirname, 'template.html');

    const readTemplate = await fs.createReadStream(tempalatePath, 'utf-8');
    let dataHtml = '';
    readTemplate.on('data', chunk => dataHtml += chunk);
    readTemplate.on('end', () => handleSearchTeanplates(dataHtml));
    readTemplate.on('error', error => console.log(error.message));
}

async function handleSearchTeanplates(data) {
    const componentsPath = path.join(__dirname, 'components');
    const files = await fsPromises.readdir(componentsPath, { withFileTypes: true });

    for (let file of files) {
        const filePath = path.join(componentsPath, file.name);
        const fileType = path.extname(file.name);
        if (fileType === '.html') {
            const teampaleComponent = await fsPromises.readFile(filePath, 'utf-8');
            const fileNameOnly = file.name.split('.')[0];
            const regExp = new RegExp(`{{${fileNameOnly}}}`, 'g');
            data = data.replace(regExp, teampaleComponent);
        }
    }
    await fsPromises.writeFile(buildHtmlFilePath, data);
}

async function readStyles(folderFrom, bundleFolder) {
    const data = [];
    const files = (await fs.promises.readdir(folderFrom, { withFileTypes: true })).reverse();
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
                inputStream.on('error', err => err);
            } else if (file.isDirectory()) {
                CloneDir(filePath, FilePathClone);
            }
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function buildingPage() {
    createBuildDir();
    handleReplaceContent();
    readStyles(sltylesFolderPath, buildSlylesFilePath);
    CloneDir(assetsPath, buildAssetsPath);
}
buildingPage();

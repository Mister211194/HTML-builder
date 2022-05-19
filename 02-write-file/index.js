const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const dirFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(dirFile);
const rl = readline.createInterface({ input, output });

init();

rl.on('line', (inputValue) => {
  if (inputValue === 'exit') {
    rl.close();
  } else {
    let value = inputValue.toString();
    stream.write(`${value}\n`);
    output.write('Введите следующую строку:\n');
  }
});

function init() {
  fs.access(dirFile, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('файла text.txt еще не существует, но сейчас он появится и вы удитете уведомление');
      createFile();
    } else {
      console.log('файл text.txt уже существует');
      output.write('Введите вашу первую строку:\n');
    }
  });
}

function createFile() {
  fs.writeFile(path.join(__dirname, 'text.txt'),
    '',
    (err) => {
      if (err) throw console.log('Невозможно создать файл:' + '' + err);
      console.log('файл text.txt успешно создан');
      output.write('Введите вашу первую строку:\n');
    });
}

process.on('exit', () => output.write('Я все, спасибо и удачи!'));

const fs = require('fs');
const path = require('path');
const { EOL: eol } = require('os');

const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(pathToFile);

stdout.write(
  `Hello! Please enter the text you want to put to a file, or 'exit' if you want to exit the program.${eol}`,
);

stdin.on('data', (data) => {
  const isExit = data.toString().trim() === 'exit';

  if (isExit) {
    process.exit();
  } else {
    stream.write(data);
  }
});

process.on('exit', () => stdout.write(`${eol}Have a good day!`));
process.on('SIGINT', () => process.exit());

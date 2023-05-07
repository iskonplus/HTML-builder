const fs = require('fs');
const path = require('path');
const process = require('node:process');

const routeTextFile = path.join(__dirname, 'text.txt');
const { stdin } = process;
const stream = fs.createWriteStream(routeTextFile);


console.log('Hello! Leave a message:\n');

stdin.on('data', (data) => {
    data.toString().trim() !== 'exit' ?
        stream.write(data) :
        processExit();
});

process.addListener('SIGINT', () => processExit());


function processExit() {
    console.log('\nYour message has been saved to a file text.txt! \nGood buy!');
    process.exit();
}


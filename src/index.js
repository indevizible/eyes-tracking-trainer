import brain from 'brain.js';
import Parser from './csv-parser';
import fs from 'fs';
import path from 'path';
const net = new brain.NeuralNetwork();

fs.readFile(path.join(__dirname, '/resources/indevizible.csv'), (err, data) => {
  if (err) {
    return console.log(err);
  }
  const csv = data.toString('utf8');
  const arr = Parser.parse(csv);
  net.train(arr);
  fs.readFile(path.join(__dirname, '/resources/test.csv'), (err, data) => {
    if (err) return console.log(err);
    const test = Parser.parse(data.toString('utf8'));
    test.forEach(v => {
      const rst = net.run(v.input);
      console.log(`
      {
        expect: ${JSON.stringify(v.output)}, 
        actual: ${JSON.stringify(rst)}
      }`);
    });
  });
});

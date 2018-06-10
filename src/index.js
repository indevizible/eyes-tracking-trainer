import brain from 'brain.js';
import Parser from './csv-parser';
import fs from 'fs';
import path from 'path';
const net = new brain.NeuralNetwork();

const readFiles = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      err ? reject(err) : resolve(files);
    });
  });
};

const getData = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      err ? reject(err) : resolve(Parser.parse(data.toString('utf8')));
    });
  });
};

readFiles(path.join(__dirname, '/resources'))
  .then(files => {
    return Promise.all(files.map(file => getData(path.join(__dirname, '/resources', file))));
  })
  .then(data => {
    data.forEach(d => {
      if (d.length) {
        net.train(d);
      }
    });
    return getData(path.join(__dirname, '/tests/test.csv'));
  })
  .then(data => {
    data.forEach(v => {
      const rst = net.run(v.input);
      console.log(`
      {
        expect: ${JSON.stringify(v.output)},
        actual: ${JSON.stringify(rst)}
      }`);
    });
  })
  .catch(e => {
    console.log(e);
  });

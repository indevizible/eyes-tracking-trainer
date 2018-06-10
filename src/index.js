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

const accurateScore = (expect, actual) => {
  const approx = (a) => {
    return a > 0.75 ? 1 : (a < 0.25 ? 0 : 0.5);
  };
  let score = 0;
  if (expect.lookAtPositionX === approx(actual.lookAtPositionX)) {
    score += 0.5;
  }
  if (expect.lookAtPositionY === approx(actual.lookAtPositionY)) {
    score += 0.5;
  }
  return score;
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
    let score = 0;
    let fullScore = 0;
    data.forEach(v => {
      const rst = net.run(v.input);
      console.log(`
      {
        expect: ${JSON.stringify(v.output)},
        actual: ${JSON.stringify(rst)}
      }`);
      fullScore++;
      score += accurateScore(v.output, rst);
    });
    console.log(`score: ${score}/${fullScore}`);
  })
  .catch(e => {
    console.log(e);
  });

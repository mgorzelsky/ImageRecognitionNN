// https://github.com/gpujs/gpu.js/#readme

const { GPU } = require('gpu.js');
const gpu = new GPU();

const inodes = 784, 
  hnodes = 200, 
  onodes = 10, 
  epochs = 10, 
  learning_rate = 0.1;

let wInputHidden = 
// wInputHidden = createRealMatrix(hnodes, inodes);
// wHiddenOutput = createRealMatrix(onodes, hnodes);
// wInputHidden = initRandom(wInputHidden, Math.pow(inodes, -0.5));
// wHiddenOutput = initRandom(wHiddenOutput, Math.pow(hnodes, -0.5));
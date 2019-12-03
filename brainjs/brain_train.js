const fs = require('fs');
const mnist = require('../mnist');
const brain = require('brain.js');

// Get the MNIST data set and put it into arrays to work with it.
async function run() {
    const trainLabels = await mnist.getTrainLabels();
    const trainDigits = await mnist.getTrainImages();

    const testLabels = await mnist.getTestLabels();
    const testDigits = await mnist.getTestImages();

    const labels = [...trainLabels, ...testLabels];
    const digits = [...trainDigits, ...testDigits];
}

// Turn the arrays of MNIST data into something that Brain.js can work with. 
const imageSize = 28 * 28;
const trainingData = [];

for (let ix = 0; ix < labels.length; ix++) {
    const start = ix * imageSize;
    const input = digits.slice(start, start + imageSize).map(mnist.normalize); // Creates an array of the data within each MNIST data set that is either filled or not, regardless of color or intensity.
    const output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    output[labels[ix]] = 1; //Check the labels array for what the value of this digit is. BOTH ARRAYS MUST MATCH ORDER.
    trainingData.push({ input, output });

    // Rotate the image 10 degrees either way and store it again to improve accuracy.
    trainingData.push({ input: mnist.rotate(input, 10), output });
    trainingData.push({ input: mnist.rotate(input, -10), output });
}
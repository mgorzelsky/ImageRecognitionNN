// https://github.com/gpujs/gpu.js/#readme

const mnist = require('../mnist');
const { GPU } = require('gpu.js');
const gpu = new GPU();

async function run() {
    const inodes = 784,
        hnodes = 200,
        onodes = 10,
        epochs = 10,
        learning_rate = 0.1;

    // Arrays that represent the connections between the 3 layers.
    let wInputToHidden = [hnodes, inodes];
    let wHiddenToOutput = [onodes, hnodes];

    // Fill each array with a randomized weight, modified by a standard deviation.
    wInputToHidden.forEach(element =>
        element = Math.random() * Math.pow(inodes, -0.5)
    );
    wHiddenToOutput.forEach(element =>
        element = Math.random() * Math.pow(hnodes, -0.5)
    );

    // Create arrays of the training labels and images. Each array is an array of array that contain the data.
    // labels [0,0,0,0,0,0,0,0,1,0] <-- 9
    // digits [0,0,0,....0] <-- array of every single digit 
    const trainLabels = await mnist.getTrainLabels();
    const trainDigits = await mnist.getTrainImages();

    const labels = [...trainLabels];
    const digits = [...trainDigits];

    const imageSize = 28 * 28;
    const trainingData = [];

    for (let ix = 0; ix < labels.length; ix++) {
        const start = ix * imageSize;
        const input = digits.slice(start, start + imageSize).map(mnist.normalize); // Creates an array of the data within each MNIST data set that is either filled or not, regardless of color or intensity.
        const output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        output[labels[ix]] = 1; //Check the labels array for what the value of this digit is. BOTH ARRAYS MUST MATCH ORDER.
        trainingData.push(input);

        // Rotate the image 10 degrees either way and store it again to improve accuracy.
        // trainingData.push( mnist.rotate(input, 10) );
        // trainingData.push( mnist.rotate(input, -10) );
    }

}

run();
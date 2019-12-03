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

    // Turn the arrays of MNIST data into something that Brain.js can work with (array of objects with {input:, output:}). 
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

    //This uses one hidden layer with a size of 150
    const netOptions = {
        hiddenLayers: [150]
    };

    //Default training options are iterations: 20_000 and threshold: 0.005. Those are fine for this task, we do want log to true to monitor progress.
    const trainingOptions = {
        log: true
    };

    //Create the crossValidate object with the net type and the options for the net we want. Then train on that net, saving the results to variable stats.
    const crossValidate = new brain.CrossValidate(brain.NeuralNetwork, netOptions);
    const stats = crossValidate.train(trainingData, trainingOptions);

    //crossValidation creates multiple nueral nets, choose the best one and save it as net.
    const net = crossValidate.toNeuralNetwork();

    //write the net to a JSON file for use later.
    const model = net.toJSON();
    fs.writeFile('../data/model.json', JSON.stringify(model), 'utf8', () => console.log('model has been written'));

}

run();
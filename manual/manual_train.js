// https://github.com/gpujs/gpu.js/#readme

const mnist = require('../mnist');
const math = require('mathjs')

////////// required variables for functions to manipulate
const inodes = 784,
    hnodes = 200,
    onodes = 10,
    epochs = 10,
    learning_rate = 0.1;

// Arrays that represent the connections between the 3 layers.
let wInputToHidden = makeArray(inodes, hnodes, 0);
let wHiddenToOutput = makeArray(hnodes, onodes, 0);

// Fill each array with a randomized weight, modified by a standard deviation.
wInputToHidden.forEach(element =>
    element = Math.random() * Math.pow(inodes, -0.5)
);
wHiddenToOutput.forEach(element =>
    element = Math.random() * Math.pow(hnodes, -0.5)
);
////////// end variables

const sigmoid = function (x) {
    return 1 / (1 + Math.exp(-x));
}

function makeArray(w, h, val) {
    var arr = [];
    for (let i = 0; i < h; i++) {
        arr[i] = [];
        for (let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

async function run() {
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

    // Run the network the number of times specified by the epoch variable.
    for (let e = 0; e < epochs; e++) {
        console.log(`running epoch: ${e + 1}`);
        for (let i = 0; i < labels.length; i++) {
            let inputs = trainingData[i];
            let target = labels[i];
            train(inputs, target);

            // console.log(inputs);
            // console.log(wInputToHidden);
        }
    }
}

function train(inputs, target) {
    // Forward Propagation
    let hiddenInputs = math.multiply(wInputToHidden, inputs);
    let hiddenOutputs = scalar(hiddenInputs, sigmoid);

    let finalInputs = math.multiply(wHiddenToOutput, hiddenOutputs);
    let finalOutputs = scalar(finalInputs, sigmoid);

    // Back Propagation
    let outputErrors = math.subtract(target, finalOutputs);
    console.log(outputErrors);
    console.log(finalOutputs);
    let t1 = multiplyElements(outputErrors, finalOutputs);
    let t2 = multiplyElements(t1 * scalar(finalOutputs, value => 1.0 - value));
    let t3 = math.multiply(t2, hiddenOutputs.transpose());
    wHiddenToOutput = math.add(wHiddenToOutput, scalar(t3, value => learning_rate * value));

    // let hiddenErrors = wHiddenToOutput.transpose() */*matrix post multiply*/ outputErrors;
    // t1 = hiddenErrors * hiddenOutputs;
    // t2 = t1 * scaler(hiddenOutputs, in -> 1.0 - in);
    // t3 = t2 */*matrix post multiply*/ input.transpose();
    // wInputToHidden = wInputToHidden + scaler(t3, in -> learning_rate * in);

    // // // back
    // // RealMatrix outputErrors = targets.subtract(finalOutputs);
    // // RealMatrix t1 = multiplyElements(outputErrors, finalOutputs);
    // // RealMatrix t2 = multiplyElements(t1, scalar(finalOutputs, in -> 1.0 - in));
    // // RealMatrix t3 = t2.multiply(hiddenOutputs.transpose());
    // // wHiddenOutput = wHiddenOutput.add(scalar(t3, in -> learning_rate * in));

    // // RealMatrix hiddenErrors = wHiddenOutput.transpose().multiply(outputErrors);
    // // t1 = multiplyElements(hiddenErrors, hiddenOutputs);
    // // t2 = multiplyElements(t1, scalar(hiddenOutputs, in -> 1.0 - in));
    // // t3 = t2.multiply(inputs.transpose());
    // // wInputHidden = wInputHidden.add(scalar(t3, in -> learning_rate * in));

}


function scalar(matrix, func) {
    let numRows = matrix.length;
    let numCols = 1;
    if (matrix[0].length !== undefined && matrix[0].length !== 0) {
        numCols = matrix[0].length;
    }
    let result = makeArray(numCols, numRows, 0);
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            result[r][c] = func(matrix[r][c]);
        }
    }

    return result;
}

function multiplyElements(matrixA, matrixB) {
    let numRows = matrixA.length;
    let numCols = 1;
    if (matrixA[0] !== undefined && matrixA[0].length !== 0) {
        numCols = matrixA[0].length;
    }
    let product = makeArray(numCols, numRows, 0);

    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            product[r][c] = matrixA[r][c] * matrixB[r][c];
        }
    }
    return product;
}

// // 		int numRows = matrixA.getRowDimension();
// // 		int numCols = matrixA.getColumnDimension();
// // 		RealMatrix product = createRealMatrix(numRows, numCols);

// // 		for (int r = 0; r < numRows; r++) {
// // 			for (int c = 0; c < numCols; c++) {
// // 				product.setEntry(r, c, matrixA.getEntry(r, c) * matrixB.getEntry(r, c));
// // 			}
// // 		}
// // 		return product;
// // 	}

run();
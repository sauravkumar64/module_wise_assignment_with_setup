const { analyzeProject, calculateComplexity } = require("codehawk-cli");
const output = analyzeProject("./"); // returns a Results object
// Get summary maintainability scores
const {
	average,
	median,
	worst,
} = output.summary;


console.log(average,median,worst,"console to pass lint");

const STATIC_SAMPLE = `
    import lodash from 'lodash';

    const chunkIntoFives = (myArr) => {
        return _.chunk(myArr, 5);
    }

    export default chunkIntoFives;
`;

const metrics = calculateComplexity(STATIC_SAMPLE);
console.log(metrics); // Inspect the full metrics

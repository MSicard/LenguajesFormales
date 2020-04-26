const AFN = require('./AFN.js');

const AFNe = (function () {
    

    convertToAFN = function () {
        let indexEpsilon = AFNe.properties.alphabet.length - 1;
        let table = [];
        // Por cada uno de los estados, se tiene que hacer lo siguiente:
        for (let indexS = 0; indexS < AFNe.properties.deltaFunction.length; indexS++) {
            // Revisar por cada una de las letras
            let transitionsByState = [];
            for (let indexWord = 0; indexWord < AFNe.properties.alphabet.length - 1; indexWord++) {
                // Se toma el valor que tiene por defecto de transición de esa letra
                let transition = [];
                Array.prototype.push.apply(transition, AFNe.properties.deltaFunction[indexS][indexWord]);
                let epsilonValues = AFNe.properties.deltaFunction[indexS][indexEpsilon];
                for (let indexEValue = 0; indexEValue < epsilonValues.length; indexEValue++) {
                    // Revisar por cada uno de los epsilon transiciones
                    let eValue = epsilonValues[indexEValue];
                    let transitionsWord = AFNe.properties.deltaFunction[eValue][indexWord];
                    if (transitionsWord.length != 0) {
                        // si el estado tiene transicion con esa letra
                        // se toma cada uno de los resultados y se guarda sus epsilon transiciones
                        for (let indexTransition = 0; indexTransition < transitionsWord.length; indexTransition++) {
                            let values = AFNe.properties.deltaFunction[transitionsWord[indexTransition]][indexEpsilon];
                            transition = [...transition, ...values];
                            let set = new Set(transition);
                            transition = [...set];
                        }
                    }
                    // si no tiene, no se agrega nada
                }
                transitionsByState.push(transition);
            }
            table.push(transitionsByState);
        }
        console.log(table)
        let AFNalphabet = AFNe.properties.alphabet;
        AFNalphabet.pop();
        minimizeAFN(table, AFNalphabet);
        return table;
    }

    const minimizeAFN = function (table, alphabet) {
        let matrixLength = AFNe.properties.states.length;
        let matrix = Array(matrixLength).fill().map(() => Array(matrixLength).fill());
        detectFinals(matrix, matrixLength);
        let hadChange = true;
        while(hadChange) {
            hadChange = loopFinals(matrixLength, matrix, alphabet, table);
            console.log(hadChange);
        }
    };

    const loopFinals = function (matrixLength, matrix, alphabet, table) {
        let hadChange = false;
        for (let i = 0; i < matrixLength; i++) {
            for (let j = 0; j < matrixLength; j++) {
                if (!matrix[i][j]) {
                    for(let alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
                        if (i == j) continue;
                        if (matrix[i][j]) continue;
                        for (let x of table[i][alphabetIndex]) {
                            if (matrix[i][j]) continue;
                            for (let y of table[j][alphabetIndex]) {
                                if (matrix[x][y]) {
                                    setInMatrix(matrix, i, j);
                                    hadChange = true;
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
        }
        return hadChange;
    }

    const detectFinals = function (matrix, matrixLength) {
        for(let i = 0; i < matrixLength; i++) {
            for (let j = 0; j < matrixLength; j++) {
                let stateOne = AFNe.properties.states[i];
                let stateTwo = AFNe.properties.states[j];
                let stateOneisFinal = AFNe.properties.finalStates.includes(stateOne)
                let stateTwoisFinal = AFNe.properties.finalStates.includes(stateTwo)
                if ((stateOneisFinal && !stateTwoisFinal) || (!stateOneisFinal && stateTwoisFinal)) {
                    setInMatrix(matrix, stateOne, stateTwo);
                }
            }
        }
    }

    const setInMatrix = function (matrix, indexA, indexB) {
        matrix[indexA][indexB] = true;
        matrix[indexB][indexA] = true;
    };

    return {
        convertToAFN
    }

})();

AFNe.properties = {
    initialState: 0,
    finalStates: [3, 4],
    alphabet: ['0', '1', '$'],
    states: [0, 1, 2, 3, 4],
    deltaFunction: [
        [[], [], [0, 1, 2]],
        [[1], [3], [1]],
        [[2, 4], [2], [2]],
        [[], [], [3]],
        [[], [], [4]]
    ],
    trips: [],
    text: "abab"
}



function runAFN() {
    // console.log(AFN.AFN);
    // console.log(AFN.AFN.subStringAccepted());
    AFNe.convertToAFN();
}

runAFN();
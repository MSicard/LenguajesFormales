// const Stack = require('./Stack.js');

class AFN {
    constructor(initialState, finalState, transitions) {
        this.initialState = initialState;
        this.finalStates = finalState;
        this.transitions = transitions;
    }

    minimize() {
        let objectTable = this.createObjectTable();
        let hadChange = true;
        while (hadChange) {
            hadChange = this.loopFinals(objectTable, this.transitionsAFD);
        }
        this.changeStates(objectTable);

        // console.log('Transitions: ', this.transitionsAFD);

    }

    changeStates(ObjectMatrix) {
        for (let key in ObjectMatrix) {
            let object = ObjectMatrix[key];
            for (let node in object) {
                let isEqual = !ObjectMatrix[key][node];
                if (isEqual) {
                    this.mergeStates(key, node);
                    this.transformState(key, node, ObjectMatrix);
                }
            }
        }
    }

    mergeStates(stateOne, stateTwo) {
        let transitionOne = this.transitionsAFD[stateOne];
        let transitionTwo = this.transitionsAFD[stateTwo];
        for (let key in transitionTwo) {
            if (!transitionOne.hasOwnProperty(key)) {
                this.transitionsAFD[stateOne][key] = transitionTwo[key];
            } 
        }
    }

    transformState(stateOne, stateTwo, ObjectMatrix) {
        let newValue = [parseInt(stateOne)];
        for (let state in this.transitionsAFD) {
            let nextNode = this.transitionsAFD[state];
            for (let node in nextNode) {
                let trans = this.transitionsAFD[state][node];
                let index = trans.indexOf(parseInt(stateTwo));
                if (index > -1) {
                    trans.splice(index, 1);
                    this.transitionsAFD[state][node] = [...new Set([...trans, ...newValue])];
                }
            }
        }
        let index = this.finalStateAFD.indexOf(stateTwo);
        if (index > -1) {
            this.finalStateAFD.splice(index, 1);
        }
        ObjectMatrix[stateOne][stateTwo] = true;
        ObjectMatrix[stateTwo][stateOne] = true;
        delete this.transitionsAFD[stateTwo];
    }

    loopFinals(ObjectMatrix) {
        let hadChange = false;
        for (let key in ObjectMatrix) {
            let state = this.transitionsAFD[key];
            let object = ObjectMatrix[key];
            for (let compareState in object) {
                if (this.transitionsDifferent(key, compareState)) {
                    hadChange = hadChange | this.isDifferentMatrix(ObjectMatrix, key, compareState);
                } else {
                    for (let node in state) {
                        if (node === '&') {
                            hadChange = hadChange | this.loopComodin(ObjectMatrix, key, node, compareState);
                        }
                        else hadChange = hadChange | this.loopNode(compareState, key, node, ObjectMatrix);
                    }
                }
            }
        }

        return hadChange == 0 ? false : true;
    }

    transitionsDifferent(state, compare) {
        let valuesState = this.transitionsAFD[state];
        let valuesCompare = this.transitionsAFD[compare];
        for (let key in valuesState) {
            if (valuesCompare.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    loopComodin(ObjectMatrix, state, node, compare) {
        let hadChange = false;
        let nextNode = this.transitionsAFD[state][node];
        let nextKeys = this.transitionsAFD[compare];
        for (let key in nextKeys) {
            if (key != '\n') {
                let transitionNode = nextKeys[key];
                nextNode.map((element) => {
                    transitionNode.map((nodes) => {
                        let isDifferent = ObjectMatrix[element][nodes];
                        if (isDifferent) {
                            hadChange = this.isDifferentMatrix(ObjectMatrix, state, compare);
                        }
                    });
                });
            }
        }
        return hadChange;
    }

    isDifferentMatrix(ObjectMatrix, state, compare) {
        if (!ObjectMatrix[state][compare]) {
            ObjectMatrix[state][compare] = true;
            ObjectMatrix[compare][state] = true;
            return true;
        }
        return false;
    }

    loopNode(compare, state, node, ObjectMatrix) {
        let hadChange = false;
        let nextNode = this.transitionsAFD[state][node];
        if (this.transitionsAFD[compare][node]) {
            let transitionNode = this.transitionsAFD[compare][node];
            nextNode.map((element) => {
                transitionNode.map((nodes) => {
                    let isDifferent = ObjectMatrix[element][nodes];
                    if (isDifferent) {
                        hadChange = this.isDifferentMatrix(ObjectMatrix, state, compare);
                    }
                });
            });
        }
        return hadChange;
    }

    createObjectTable() {
        console.log(this.transitionsAFD);
        let objectMatrix = {};
        for (let key in this.transitionsAFD) {
            let row = {};
            for (let value in this.transitionsAFD) {
                if (key != value) {
                    row[value] = false;
                    let stateOneisFinal = this.finalStateAFD.includes(key);
                    let stateTwoisFinal = this.finalStateAFD.includes(value);
                    if ((stateOneisFinal && !stateTwoisFinal) || (!stateOneisFinal && stateTwoisFinal)) {
                        row[value] = true;
                    }
                }
            }
            objectMatrix[key] = row;
        }
        return objectMatrix;
    }


    convertAFD() {
        let stack = [];
        this.finalStateAFD = [];
        this.getAlphabet();
        this.createEmptyState();
        this.stack
        this.getInitialTransition(this.initialState, stack);
        while(stack.length > 0) {
            let value = stack.pop();
            this.getAFDTransition(value, stack);
        }

        console.log('///////////////AFD//////////////');
        console.log('initialState: ', this.initialState);
        console.log('Transitions: ', JSON.stringify(this.transitionsAFD));
        console.log('finalState: ', this.finalStateAFD);
        this.minimize(this.transitionsAFD);
        console.log('///////////////minimize//////////////');
        console.log('initialState: ', this.initialState);
        console.log('Transitions: ', JSON.stringify(this.transitionsAFD));
        console.log('finalState: ', this.finalStateAFD);
    }


    getInitialTransition(state, stack) {
        this.transitionsAFD[state] = {};
        this.alphabet.forEach(element => {
            if (this.transitions[state][element]) {
                let value = this.transitions[state][element].join('/');
                this.transitionsAFD[state][element] = [value];
                stack.push(value);
            }
            else this.transitionsAFD[state][element] = [-1];
        });
    }

    getAFDTransition(value, stack) {
        // Revisar si existe la transición
        if (this.transitionsAFD[value] !== undefined) {
            return;
        }
        this.transitionsAFD[value] = {};
        let states = value.split('/');
        // Unir transiciones por cada valor del alfabeto
        this.alphabet.forEach(element => {
            let transitions = [];

            // Unir transiciones
            states.forEach(state => {
                if (this.transitions[state][element]) {
                    transitions = [...new Set([...transitions ,...this.transitions[state][element]])];
                }

                if (this.finalStates.includes(parseInt(state)) && !this.finalStateAFD.includes(value)) {
                    this.finalStateAFD.push(value);}
            });

            // Agregarlo en la funcion
            if (transitions.length > 0) {
                let trans = transitions.join('/');
                this.transitionsAFD[value][element] = [ trans ];
                if (this.transitionsAFD[trans] === undefined){
                    stack.push(trans); 
                }
            } else {
                this.transitionsAFD[value][element] = [-1]
            }
        });
    }



    createEmptyState() {
        this.transitionsAFD = {};
        this.transitionsAFD[-1] = {};
        this.alphabet.forEach(element => {
            this.transitionsAFD[-1][element] = [-1];
        });
    }

    getAlphabet() {
        let alphabet = [];
        for(let state in this.transitions) {
            alphabet = [...new Set([...alphabet ,...Object.keys(this.transitions[state])])];
        }
        this.alphabet = alphabet;
    }
}

let transitions = {
    '1': { a: [ 2 ] },
    '2': { d: [ 3 ] },
    '3': { r: [ 4 ] },
    '4': { e: [ 7 ] },
    '6': { '&': [ 8, 7, 9 ], p: [ 1, 7 ] },
    '7': { '&': [ 8, 7, 9 ] },
    '8': { '&': [ 8, 7, 9 ], w: [ 10 ] },
    '9': { w: [ 10 ] },
    '10': { w: [ 11 ] },
    '11': { w: [ 12 ] },
    '12': { '&': [ 13, 12, 14 ] },
    '13': { '&': [ 13, 12, 14 ], c: [ 15 ] },
    '14': { c: [ 15 ] },
    '15': { o: [ 16 ] },
    '16': { m: [ 17 ] },
    '17': {}
  }

/*let initialState = 6;
let finalStates = [17];
let afn = new AFN(initialState, finalStates, transitions);

afn.convertAFD();*/
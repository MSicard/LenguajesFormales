// const Stack = require('./Stack.js');

class AFNp {

    constructor (postFijo) {
        this.postFijo = postFijo;
        this.index = 0;
        this.stack = new Stack();
        this.transitions = {};
        this.initialState = 0;
        this.finalState = [];
    }

    convertToAFN() {
        this.postFijo.forEach(element => {
            
            switch(element) {
                case '.':
                    // console.log('Combine in stack');
                    this.concatStates();
                    break;
                case ',':
                    // console.log('New state, combine states');
                    this.combineStates();
                    break;
                case '*':
                    // console.log('Recursive with epsilon');
                    this.zeroToManyState();
                    break;
                case '+':
                    // console.log('Recursive');
                    this.oneToManyState();
                    break;
                default:
                    // console.log('Add state');
                    this.addState(element);
                    break;
            }
            // console.log(this.transitions);
        });
        this.setFinalState();
        console.log('///////////////AFNp//////////////');
        console.log('Initial State: ', this.initialState);
        console.log('Delta function: ', JSON.stringify(this.transitions));
        console.log('FinalStates: ', this.finalState);
    }

    needAnotherState(state) {
        let node = this.transitions[state];
        for (let key in node) {
            if (node[key].length === 0) {
                return true;
            } 
        }
        return false;
    }

    setFinalState() {
        let lastLine = this.stack.pop();
        let lastState = lastLine[lastLine.length - 1];
        if (Array.isArray(lastState)) {
            let state = false;
            let finalState;
            lastState.forEach(element => {
                if (this.needAnotherState(element)) {
                    if (!state) {
                        this.addState();
                        state = true;
                        finalState = this.stack.pop();
                    }
                    this.addTransitionsInEmpty(element, finalState[0]);
                } else {
                    this.finalState.push(element);  
                }
            });
            this.finalState.push(finalState[0]);
            let merge = lastLine.concat(finalState);
            this.stack.push(merge);
        } else {
            if (this.needAnotherState(lastState)) {
                this.addState();
                let finalState = this.stack.pop();
                this.addTransitionsInEmpty(lastState, finalState[0]);
                this.finalState.push(finalState[0]);
                let merge = lastLine.concat(finalState);
                this.stack.push(merge);
            } else {
                this.finalState.push(lastState);
                this.stack.push(lastLine);
            }
        }
    }

    zeroToManyState() {
        // console.log('zero to many!!!!!!!');
        // console.log('transitions:', this.transitions);
        let lastLine = this.stack.pop();
        let lastState = lastLine.pop();
        let firstState = lastLine[0];
        let merge = lastLine;
        if (Array.isArray(lastState)) {
            lastState.forEach(element => {
                if (element === firstState) {
                    this.addTransitionsInEmpty(element, firstState)
                } else {
                    this.addTransitions(element, firstState);
                    merge = merge.concat(element);
                }
            });
            this.transitions[firstState]['$'] = [];
            merge = merge.concat(firstState);
            this.stack.push(merge);
        }
        else {
            if (firstState === undefined) firstState = lastState;
            if (firstState === lastState) {
                this.addTransitionsInEmpty(lastState, firstState);
            } else {
                this.addTransitions(lastState, firstState);
                merge = merge.concat(lastState);
            }
            this.transitions[firstState]['$'] = [];
            merge = merge.concat(firstState);
            this.stack.push(merge);
        }
    }

    addTransitionsInEmpty(inState, nextState) {
        let transition = this.transitions[inState];
        for (let key in transition) {
            if (transition[key].length === 0) {
                transition[key].push(nextState);
            }
        }
    }
    addTransitions(inState, nextState ) {
        let transition = this.transitions[inState];
        for (let key in transition) {
            transition[key].push(nextState);
        }
    }

    oneToManyState() {
        let lastLine = this.stack.pop();
        let lastState = lastLine[lastLine.length - 1];
        let firstState = lastLine[0];

        let node = this.addState('$');
        node['$'].push(firstState);

        let newState = this.stack.pop();

        if (Array.isArray(lastState)) {
            lastLine.pop();
            lastState.forEach(element => {
                this.addTransitionsInEmpty(element, newState[newState.length - 1]);
                lastLine.push(element);
            });
        } else {
            this.addTransitions(lastState, newState[newState.length - 1]);
        }
        let merge = lastLine.concat(newState);
        this.stack.push(merge);
    }

    deletedStateCheck(deleted, newstate, arr) {
        arr.forEach(element => {
            let object = this.transitions[element];
            for (let value in object) {
                if (object[value].includes(deleted)) {
                    const index = object[value].indexOf(deleted);
                    object[value].splice(index, 1);
                    object[value].push(newstate);
                }
            }
        });
    }

    combineTwoStatesInOne(oneState, twoState) {
        let newNode = this.transitions[oneState];
        let object = this.transitions[twoState];
        for (let value in object) {
            if (newNode.hasOwnProperty(value)) {
                newNode[value] = newNode[value].concat(object[value]);
            }
            else {
                newNode[value] = object[value];
            }
        }

        if (oneState === this.initialState) this.initialState = this.index;
        if (twoState === this.initialState) this.initialState = this.index;
        
        return newNode;
    }

    combineStates() {
        let lastLine = this.stack.pop();
        let prevLine = this.stack.pop();
        let oneState = lastLine.shift();
        let twoState = prevLine.shift();

        // Combinamos y Guardamos
        let newNode = this.combineTwoStatesInOne(oneState, twoState);
        this.transitions[this.index] = newNode;

        delete this.transitions[oneState];
        this.deletedStateCheck(oneState, this.index, lastLine);
        delete this.transitions[twoState];
        this.deletedStateCheck(twoState, this.index, prevLine);

        let oneLastState = lastLine.pop();
        let twoLastState = prevLine.pop();

        // Merge para el stack :D
        let merge = [this.index];
        merge = merge.concat(prevLine);
        merge = merge.concat(lastLine);

        let states = [];
        if (oneLastState !== undefined) states.push(oneLastState);
        if (twoLastState !== undefined) states.push(twoLastState);
        if (this.needAnotherState(this.index)) states.push(this.index);
        if (states.length > 0) {
            merge.push(states);
        }

        this.stack.push(merge);
        this.index++;
    }

    concatStates() {
        let lastLine = this.stack.pop();
        let prevLine = this.stack.pop();
        let setState = lastLine[0];
        let inState = prevLine[prevLine.length -1 ];
        let merge;
        if (Array.isArray(inState)) {
            inState = prevLine.pop();
            inState.forEach(element => {
                let transition = this.transitions[element];
                for (let key in transition) {
                    transition[key].push(setState);
                }
            });
            merge = prevLine.concat(inState);
        } else {
            let transition = this.transitions[inState];
            for (let key in transition) {
                transition[key].push(setState);
            }
        }
        merge = prevLine.concat(lastLine);
        this.stack.push(merge);
    }

    addState(value) {
        let node = this.createState(value);
        this.transitions[this.index] = node;
        this.stack.push([this.index]);
        this.index++;
        return node;
    }

    createState(value) {
        let node = {};
        if (value === undefined) return node;
        node[value] = [];
        return node;
    }

}

/* let postfijo =   [
    'p', 'a', '.', 'd', '.', 'r', '.',
    'e', '.', ' ', '.', '&', '*', '.',
    'c', '.', 'o', '.', 'm', '.', 'w',
    'w', '.', 'w', '.', '&', '*', '.',
    'c', '.', 'o', '.', 'm', '.', ','
  ]

let afnp = new AFNp(postfijo);
afnp.convertToAFN();*/
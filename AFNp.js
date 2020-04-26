const Stack = require('./Stack.js');

class AFNp {

    constructor (postFijo) {
        this.postFijo = postFijo;
        this.index = 0;
        this.stack = new Stack();
        this.transitions = {};
        this.initialState = 0;
    }

    convertToAFN() {
        this.postFijo.forEach(element => {
            switch(element) {
                case '.':
                    console.log('Combine in stack');
                    this.concatStates();
                    break;
                case ',':
                    console.log('New state, combine states');
                    this.combineStates();
                    break;
                case '*':
                    console.log('Recursive with epsilon');
                    break;
                case '+':
                    this.oneToManyState();
                    console.log('Recursive');
                    break;
                default:
                    console.log('entrada');
                    this.addState(element);
                    break;
            }
        });
        console.log(this.initialState);
        console.log(this.stack);
        console.log(this.transitions);
    }

    oneToManyState() {
        let lastLine = this.stack.pop();
        let lastState = lastLine[lastLine.length - 1];
        let firstState = lastLine[0];

        let node = this.addState('$');
        node['$'].push(firstState);

        let newState = this.stack.pop();
        let transition = this.transitions[lastState];
        for (let key in transition) {
            transition[key].push(newState[newState.length - 1]);
        }

        let merge = lastLine.concat(newState);
        this.stack.push(merge);
    }

    combineStates() {
        let lastLine = this.stack.pop();
        let prevLine = this.stack.pop();
        let oneState = lastLine.shift();
        let twoState = prevLine.shift();

        // Combinamos y Guardamos
        let newNode = Object.assign(this.transitions[oneState], this.transitions[twoState]);
        this.transitions[this.index] = newNode;

        delete this.transitions[oneState];
        delete this.transitions[twoState];

        if (oneState === this.initialState) this.initialState = this.index;
        if (twoState === this.initialState) this.initialState = this.index;

        let oneLastState = lastLine.pop();
        let twoLastState = prevLine.pop();

        // Merge para el stack :D
        let states = [oneLastState, twoLastState];
        let merge = [this.index];
        merge = merge.concat(prevLine);
        merge = merge.concat(lastLine);
        merge.push(states);
        this.stack.push(merge);
        this.index++;

    }

    concatStates() {
        let lastLine = this.stack.pop();
        let prevLine = this.stack.pop();
        let setState = lastLine[lastLine.length -1 ];
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
        node[value] = [];
        return node;
    }

}


let postfijo = [
    'a', 'b', '.', 'c',  '.',
    'd', 'e', '.', ',',  '&',
    '+', '.', 'c', '.',  'o',
    '.', 'm', '.', '\n', '.'
  ]

let afnp = new AFNp(postfijo);
afnp.convertToAFN();
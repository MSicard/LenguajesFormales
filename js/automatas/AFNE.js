class  AFNE {
    constructor(initialState, finalState, transitions) {
        this.initialState = initialState;
        this.finalState = finalState;
        this.Etransitions = transitions;
        this.transitions = {};
    }

    convertToAFN()  {
        console.log(this.Etransitions);
        for(let value in this.Etransitions) {
            let state = this.Etransitions[value];
            for (let node in state) {
                if (node == '$') {
                    this.processEpsilon(value, state, node);
                } else {
                    this.processValue(value, state, node);
                }
            }

            if (Object.keys(state).length == 0) {
                this.transitions[value] = state;
            }
        }
        console.log('///////////////AFNE//////////////');
        console.log('Initial State: ', this.initialState);
        console.log('Transicions: ', this.transitions);
        console.log('FinalState: ', this.finalState);
    }

    processEpsilon(state, node, alphabet) {
        let value = node[alphabet]
        value.forEach(element => {
            let nextState = this.Etransitions[element];
            for (let nextNode in nextState) {
                if (nextNode === '$') continue;
                this.processEpsilonValue(state, nextState, nextNode);
            }
        })
    }

    processEpsilonValue(state, node, alphabet) {
        let nextState = node[alphabet];
        nextState.forEach(element => {
            let nextNode = this.Etransitions[element];
            let newStates = [element];
            if (newStates.length !== 0) {
                if (nextNode.hasOwnProperty('$') && nextNode['$'].length > 0) {
                    newStates = [...new Set([...newStates ,...nextNode['$']])];
                }
                let thisState = this.Etransitions[state];
                if (thisState.hasOwnProperty(alphabet)) {
                    newStates = [...new Set([...newStates, ...thisState[alphabet]])];
                }
                this.setValue(state, alphabet, newStates);
            }
        });
    }

    processValue(state, node, alphabet) {
        let value = node[alphabet];
        value.forEach(element => {
            let epsilonTrans = this.Etransitions[element];
            if (epsilonTrans.hasOwnProperty('$')) {
                value = [...new Set([...value ,...epsilonTrans['$']])];
            }
            this.setValue(state, alphabet, value);
        });
    }

    setValue(state, alphabet, nextStates) {
        if (!this.transitions.hasOwnProperty(state)) {
            this.transitions[state] = {};
        }
        if (!this.transitions[state].hasOwnProperty(alphabet)) {
            this.transitions[state][alphabet] = [];
        }
        this.transitions[state][alphabet] = nextStates;
    }
}

/* let epsilon = {"1":{"a":[2]},"2":{"d":[3]},"3":{"r":[4]},"4":{"e":[7]},"6":{"$":[7],"p":[1,7]},"7":{"&":[8]},"8":{"$":[7,9]},"9":{"w":[10]},"10":{"w":[11]},"11":{"w":[12]},"12":{"&":[13]},"13":{"$":[12,14]},"14":{"c":[15]},"15":{"o":[16]},"16":{"m":[17]},"17":{}}

let afne = new AFNE(6, [17], epsilon);
afne.convertToAFN();*/
const AFN = (function () {

    const isAccepted = function() {
        for (let i = 0; i < AFN.properties.trips.length; i++) {
            let splitValues = AFN.properties.trips[i].split('/');
            let lastValue = parseInt(splitValues[splitValues.length - 2]);
            if (AFN.properties.finalStates.includes(lastValue)) {
                return true;
            }
        }
        return false;
    }

    const processText = function(text, state, trip) {
        if (text.length == 0) {
            AFN.properties.trips.push(trip);
            return trip;
        }

        let myValue = AFN.properties.alphabet.indexOf(text.charAt(0));
        let myState = AFN.properties.deltaFunction[state][myValue];

        if (myState.length == 0) {
            myState = -1;
            trip += myState + '/'
            AFN.properties.trips.push(trip);
            return trip;
        }

        for (let indexState = 0; indexState < myState.length; indexState++) {
            processText(text.substring(1), myState[indexState], trip + myState[indexState] + '/');
        }
        
        return;
    }

    const subStringAccepted = function() {
        let mySubStrings = [];
        let myAcceptedSubStrings = [];
        for(let i = 0; i < AFN.properties.text.length; i++) {
            for(let j = i; j <= AFN.properties.text.length; j++) {
                let subString = AFN.properties.text.substring(i, j);
                
                if (!mySubStrings.includes(subString)) {
                    AFN.properties.trips = [];
                    processText(subString, AFN.properties.initialState, AFN.properties.initialState + '/');
                    
                    if (isAccepted()) {
                        myAcceptedSubStrings.push(subString);
                    }
                    mySubStrings.push(subString);
                }
            }
        }
        return myAcceptedSubStrings;
    }

    return {
        subStringAccepted,
        processText,
        isAccepted
    }

})();

AFN.properties = {
    initialState: 0,
    finalStates: [2],
    alphabet: ['a', 'b'],
    states: [0, 1, 2],
    deltaFunction: [
        [[0, 1], [0]], 
        [[], [2]],
        [[], []]
    ],
    trips: [],
    text: "abab"
}


module.exports = {
    AFN
}
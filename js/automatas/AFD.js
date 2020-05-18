class AFD {
    constructor(initialState, finalState, transitions) {
        this.initialState = initialState;
        this.finalStates = finalState;
        this.transitions = transitions;
        this.accepted = false;
    }

    processText(text, state, trip) { 
        console.log(text + ' - ' + 'state', trip);
        let splitValues = trip.split('/');
        let lastValue = splitValues[splitValues.length - 2];
        
        if (lastValue === "-1" ) return;
        if (this.accepted) return;

        if (text.length == 0) {
            // this.trips.push(trip);
            this.accepted = this.isAccepted(trip);
            return;
        }

        let nextCharacter = text.charAt(0);
        let value = this.transitions[state][nextCharacter];

        if (this.transitions[state].hasOwnProperty('&')) {
            let comodin = this.transitions[state]['&'];
            const patt = new RegExp(/\w/g);
            if (patt.test(nextCharacter) || nextCharacter === " " || 
                    nextCharacter === "." || nextCharacter === 'á' ||
                    nextCharacter === "é" || nextCharacter === 'í' ||
                    nextCharacter === 'ó' || nextCharacter === 'ú' ||
                    nextCharacter === 'ñ') { 
                
                for(let nextNode in comodin) {
                    let newTrip = trip.toString();
                    this.processText(text.substring(1), comodin[nextNode], newTrip + comodin[nextNode] + '/');
                }      

            }
        }
        
        if (Array.isArray(value) && value.length > 0 ) {
            for(let nextNode in value) {
                if(value[nextNode] === -1) continue;
                this.processText(text.substring(1), value[nextNode], trip + value[nextNode] + '/');
            }
        } else {
            trip += -1 + '/';
        }
        return;
    }

    isAccepted(trip) {
        // console.log(this.trips);
        let splitValues = trip.split('/');
        let lastValue = splitValues[splitValues.length - 2];
        if (this.finalStates.includes(lastValue)) {
            return true;
        }
        return false;
    }

    subStringAccepted(word) {
        console.log(word);
        let mySubStrings = [];
        let myAcceptedSubStrings = [];

        for (let i = 0; i < word.length; i++) {
            for (let j = i; j < word.length + 1; j++) {
                let subString = word.substring(i, j);
                if (!mySubStrings.includes(subString)) {
                    // console.log(subString);
                    this.accepted = false;
                    this.processText(subString, this.initialState, `${this.initialState}/`);

                    if(this.accepted) {
                        myAcceptedSubStrings.push(subString);
                    }
                   
                    mySubStrings.push(subString);
                }
            }
        }
        console.log('///////////////ACCEPTED//////////////');
        console.log(myAcceptedSubStrings);
        return myAcceptedSubStrings;
    }
}

/*let transitions = 
  {
    '0': {
      h: [ '1' ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '1': {
      h: [ -1 ],
      s: [ '2' ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '2': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ '3' ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '3': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ '4' ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '4': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ '5' ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '5': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ '6' ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '6': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ '7' ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '7': {
      h: [ -1 ],
      s: [ '8' ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '8': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ '9/8/10' ],
      '\n': [ -1 ]
    },
    '11': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '-1': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ -1 ],
      '\n': [ -1 ]
    },
    '9/8/10': {
      h: [ -1 ],
      s: [ -1 ],
      c: [ -1 ],
      r: [ -1 ],
      i: [ -1 ],
      p: [ -1 ],
      t: [ -1 ],
      '&': [ '9/8/10' ],
      '\n': [ '11' ]
    }
  };

let initialState = 0;
let finalStates = ['11'];
let afd = new AFD(initialState, finalStates, transitions);
let word = `hscripts tiene muchos valiosos scripts disponibles
Este es el sitio padre www.forums.hscripts.com
hscripts incluye tutoriales e imágenes gratuitos
Compre scripts con nosotros
`;

afd.subStringAccepted(word);*/

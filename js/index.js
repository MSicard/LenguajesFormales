let myAFD;

function ReadFile(element, regex) {
    let input = document.getElementById(element);

    if (input.files.length === 0) {
        return false;
    }

    const fr = new FileReader();
    fr.onload = function () {
        var data = fr.result;
        if (regex) generatePostFIjo(data);
        else getAccepted(data);
    };

    fr.readAsText(input.files[0], 'uft8');
    return true;
}

function generatePostFIjo(rexpr) {
    console.log('///////////////POSTFIJO//////////////');
    let postFijo = PostFijo.convertRegularExpression(rexpr);
    let pf = document.getElementById('pf');
    pf.innerText = JSON.stringify(postFijo['items'].join(' '));
    generateAFNE(postFijo);
}

function generateAFNE(postfijo) {
    let afnp = new AFNp(postfijo['items']);
    afnp.convertToAFN();
    let afne = document.getElementById('afne');
    afne.innerText = JSON.stringify(afnp.transitions);
    generateAFN(afnp.initialState, afnp.finalState, afnp.transitions);
}

function generateAFN(initialState, finalState, transitions) {
    let afne = new AFNE(initialState, finalState, transitions);
    afne.convertToAFN();
    console.log('afne: ', afne.transitions);
    let afn = document.getElementById('afn');
    afn.innerText = JSON.stringify(afne.transitions);
    generateAFD(afne.initialState, afne.finalState, afne.transitions);
}

function generateAFD(initialState, finalState, transitions) {
    let afn = new AFN(initialState, finalState, transitions);
    afn.convertAFD();
    let afd = document.getElementById('afd');
    afd.innerText = JSON.stringify(afn.transitionsAFD);
    myAFD = new AFD(afn.initialState, afn.finalStateAFD, afn.transitionsAFD);
}

function getAccepted(word) {
    if (myAFD != null) {
        // myAFD.subStringAccepted(word);
        let accept = document.getElementById('aceptadas');
        accept.innerText = myAFD.subStringAccepted(word).join('\n');
    }
}

$(document).ready(function () {
    console.log("ready!");
    $('#btn_regular_expression').on('click', function () {
        let text = ReadFile("file_re", true);
        if (text) {
            console.log('si hay archivo');
        } else {
            console.log('No hay archivo hehe');
        }
    });

    $('#btn_word').on('click', function () {
        let text = ReadFile("file_word", false);
        if (text) {
            console.log('si hay archivo');
        } else {
            console.log('No hay archivo');
        }
    })
});
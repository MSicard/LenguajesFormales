function printASCII() {
    let values = ['Á', 'É', 'Í', 'Ó', 'Ú', 'á', 'é', 'í', 'ó', 'ú', 'a', 'e', 'i', 'o', 'u', '\n'];
    for(value in values) {
        console.log(values[value] + '= ' + values[value].charCodeAt(0));
    } 

}

// printASCII();

const RegularExpression = function () {
    
    return { 

    };
}();

RegularExpression.properties = {
    expression: "(abc,de)&+com\n"
}
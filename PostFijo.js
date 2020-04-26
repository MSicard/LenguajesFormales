const Stack = require('./Stack.js');

const PostFijo = ( function () {
    const convertRegularExpression = function (expression) {
        for (let i = 0; i < expression.length; i++ ) {
            let value = expression[i];
            switch (value) {
                case ')':
                    rightP();
                    break;
                case '(':
                    PostFijo.properties.stack.push(value);
                    break;
                case ',':
                case '+':
                case '*':
                    // Se mete al stack
                    console.log('value: ', value);
                    operator(value);
                    break;
                default: // valor del alfabeto
                    alphabet(expression[i - 1]);
                    PostFijo.properties.expression.push(value);
                    break;
            }
        }
        while (!PostFijo.properties.stack.isEmpty()) {
            PostFijo.properties.expression.push(PostFijo.properties.stack.pop());
        }
        console.log("Final: ", PostFijo.properties.expression);
    }

    const rightP = function () {
        // agregar valores  hasta encontrar el parentesis izquierdo
        while (!PostFijo.properties.stack.isEmpty()) {
            let value = PostFijo.properties.stack.pop();
            if (value == '(') return;
            PostFijo.properties.expression.push(value);
        }
    }

    const alphabet = function (vbefore) {
        switch (vbefore) {
            case '(':
            case ',':
                return;
            default: // Agregar la concatenación como operador. 
                operator('.');
        }
    }

    const operator = function (op) {
        if (! PostFijo.properties.stack.isEmpty()) {
            console.log(op);
            console.log(PostFijo.properties.stack);
            let precedencia = PostFijo.properties.precedencia.indexOf(op);
            let value = PostFijo.properties.stack.peek();
            if (PostFijo.properties.precedencia.indexOf(value) >= precedencia) {
                PostFijo.properties.expression.push(PostFijo.properties.stack.pop());
                operator(op);
                return;
            }
        } else {
            
        }
        PostFijo.properties.stack.push(op);
    }

    return {
        convertRegularExpression
    };

})();


PostFijo.properties = {
    stack: new Stack(),
    expression: new Stack(),
    regularExpression: "(abc,de)&+com\n",
    precedencia: [',', '.', '+', '*']
}

PostFijo.convertRegularExpression(PostFijo.properties.regularExpression);



// const Stack = require('./Stack.js');

const PostFijo = ( function () {
    const initPostFijo = function (expression) {
        PostFijo.properties.expression = new Stack();
        PostFijo.properties.stack = new Stack();
        PostFijo.properties.regularExpression = expression;
    }

    const convertRegularExpression = function (expression) {
        initPostFijo(expression);
        for (let i = 0; i < expression.length; i++ ) {
            let value = expression[i];
            switch (value) {
                case ')':
                    rightP();
                    break;
                case '(':
                    leftP(expression[i - 1]);
                    PostFijo.properties.stack.push(value);
                    // operator(value);
                    break;
                case ',':
                case '+':
                case '*':
                    // Se mete al stack
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

        return PostFijo.properties.expression;
    }

    const leftP = function (vbefore) {
        if (vbefore !== undefined && vbefore !== ',')
            operator('.') 
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
            case undefined:
                return;
            default: // Agregar la concatenación como operador si hay dos letras juntas
                operator('.');
        }
    }

    const operator = function (op) {
        if (! PostFijo.properties.stack.isEmpty()) {
            let precedencia = PostFijo.properties.precedencia.indexOf(op);
            let value = PostFijo.properties.stack.peek();
            if (PostFijo.properties.precedencia.indexOf(value) >= precedencia) {
                PostFijo.properties.expression.push(PostFijo.properties.stack.pop());
                operator(op);
                return;
            }
        }   
        PostFijo.properties.stack.push(op);   
    }

    return {
        convertRegularExpression
    };

})();


PostFijo.properties = {
    stack: null,
    expression: null,
    regularExpression: "(padre &*com),(www&*com)",
    precedencia: [',', '.', '+', '*']
}


// console.log(PostFijo.convertRegularExpression(PostFijo.properties.regularExpression));



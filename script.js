function update(value){
    var display = document.getElementById('display');
    if (value === 'c'){
        display.innerHTML = '';
    }
    else if(value === 'x'){
        display.innerHTML = display.innerHTML.slice(0, -1);
    }
    else if(value === '='){
        try {
            var init = display.innerHTML;
            var result = calculate(init);
            if (result === 'Error') {
                display.innerHTML = 'Error';
            }
            else {
                display.innerHTML = result;
            }
        }
        catch (error) {
            display.innerHTML = 'Error';
        }
    }

    else {
        display.innerHTML += value;
    }
}
function calculate(str) {
    str = str.replace(/[^0-9+\-*/.]/g, '');
    if (!str) return '';

    const output = [];
    const ops = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const associativity = { '+': 'L', '-': 'L', '*': 'L', '/': 'L' };
    let i = 0;
    while (i < str.length) {
        let ch = str[i];
        if (ch >= '0' && ch <= '9' || ch === '.') {
            let num = '';
            while (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i] === '.')) {
                num += str[i++];
            }
            output.push(parseFloat(num));
            continue;
        } else if (ch in precedence) {
            while (
                ops.length &&
                ops[ops.length - 1] in precedence &&
                ((associativity[ch] === 'L' && precedence[ch] <= precedence[ops[ops.length - 1]]) ||
                 (associativity[ch] === 'R' && precedence[ch] < precedence[ops[ops.length - 1]]))
            ) {
                output.push(ops.pop());
            }
            ops.push(ch);
        }
        i++;
    }
    while (ops.length) {
        output.push(ops.pop());
    }

    const stack = [];
    for (let token of output) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            if (stack.length < 2) return 'Error';
            let b = stack.pop();
            let a = stack.pop();
            if (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else if (token === '/') {
                if (b === 0) return 'Error';
                stack.push(a / b);
            }
        }
    }
    if (stack.length !== 1 || isNaN(stack[0])) return 'Error';
    return stack[0];
}
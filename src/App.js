"use strict";
let inputString = '';
let input = document.querySelector('#result');
let previous = '';
let next = '';
document.body.onkeydown = (event) => {
    try {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (!Number(input.value))
                previous = input.value;
            inputString = input.value.replace(',', '.');
            input.value = String(eval(inputString || '0')).split('.').join();
        }
        if (event.ctrlKey && !event.shiftKey && event.keyCode === 90) {
            event.preventDefault();
            if (input.value !== previous) {
                next = input.value;
                input.value = previous;
            }
        }
        if ((event.ctrlKey && event.shiftKey && event.keyCode === 90
            || event.ctrlKey && event.keyCode === 89)) {
            event.preventDefault();
            if (input.value !== next) {
                previous = input.value;
                input.value = next;
            }
        }
        // console.log(event.key, event.keyCode)
    }
    catch (e) { }
};
input.addEventListener('input', (event) => {
    let value = event.target.value;
    if (['+', '/', '*', '!', '.', ','].includes(value[0]))
        value = value.slice(1);
    input.value = value.replace(/[^0-9\-\/\*\+()\.\,\!]/g, '')
        .replace(/(\*[\+\-\.\,\/\!])|(\*+)/g, '*')
        .replace(/(\![\+\-\.\,\/\*])|(\!+)/g, '!')
        .replace(/(\+[\*\-\.\,\/\!])|(\++)/g, '+')
        .replace(/(\-[\+\*\.\,\/\!])|(\-+)/g, '-')
        .replace(/(\/[\+\-\.\,\*\!])|(\/+)/g, '/')
        .replace(/(\,[\+\-\.\*\/\!])|(\,+)/g, ',')
        .replace(/(\.[\+\-\*\,\/\!])|(\.+)/g, '.');
});
const fac = (n) => {
    if (Number.isInteger(n))
        return n ? n * (fac(n - 1)) : 1;
    return NaN;
};

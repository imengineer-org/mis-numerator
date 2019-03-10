'use strict';

const keyLetters = {
    'KeyF':"а",
    'Comma':'б',
    'KeyD':'в',
    'KeyU':'г',
    'KeyL':'д',
    'KeyT':'е',
    'Backquote':'ё',
    'Semicolon':'ж',
    'KeyP':'з',
    'KeyB':'и',
    'KeyQ':'Й',
    'KeyR':'к',
    'KeyK':'л',
    'KeyV':'м',
    'KeyY':'н',
    'KeyJ':'о',
    'KeyG':'п',
    'KeyH':'р',
    'KeyC':'с',
    'KeyN':'т',
    'KeyE':'у',
    'KeyA':'ф',
    'BracketLeft':'х',
    'KeyW':'ц',
    'KeyX':'ч',
    'KeyI':'ш',
    'KeyO':'щ',
    'KeyS':'ы',
    'Quote':'э',
    'Period':'ю',
    'KeyZ':'я',
};

class CharButton {
    constructor(key, char, containerEl, actionHandler) {
        this.key = ''+key;
        this.char = char.toUpperCase().trim()[0];
        this.id = 'button-'+this.key;
        this.el = document.createElement('div');
        this.el.innerText = this.char;
        this.el.id = this.id;
        this.el.className = 'key-button';
        this.el.setAttribute('char', this.char);
        this.el.setAttribute('key', this.key);
        this.actionHandler = actionHandler;
        containerEl.appendChild(this.el);
        this.action = (e)=>{
            //console.log(`${this.char}`);
            this.callHandler();
            this.el.classList.add('selected');
            setTimeout(()=>{this.el.classList.remove('selected')},1000);
        };
        this.el.addEventListener('click', this.action);
    }//constructor
    callHandler() {
        this.actionHandler(this.char);
    }
} //class CharButton

const mainDisplay = document.getElementById('main-display');
const range = document.createRange();
const resultsList = document.getElementById('results-list');

/*
const bookingId() {
    let xhr = new XMLHttpRequest();
    xhr.open('get','http://localhost',true);
    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState != 4) return;

        //tton.innerHTML = 'Готово!';

        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert(xhr.responseText);
        }

    }
}
*/

const actionHandler = (inChar) => {
    console.log(`actionHandler(${inChar})`);
    let result = inChar+('0000'+Math.round(1000*Math.random(),0)).slice(-4);
    console.log(`actionHandler result = ${result}`);
    mainDisplay.innerText = result;
    window.getSelection().removeAllRanges();
    range.selectNode(mainDisplay);
    window.getSelection().addRange(range);
    try {
        document.execCommand('copy');
    } catch(err) {
        console.log('Can`t copy, boss');
    }
    window.getSelection().removeAllRanges();
    let li = document.createElement('li');
    for (let item of resultsList.querySelectorAll('div')) {
        item.classList.remove('fresh');
    }
    li.innerHTML = `<div class="fresh">${result}</div>`;
    resultsList.insertBefore(li, resultsList.children[0]);
};//actionHandler

class Keyboard {
    constructor(keySet, containder) {
    }
}

const displayContainer = document.getElementById('keycode-container');
const buttonsContainer = document.getElementById('buttons-container');
console.log(buttonsContainer);
const buttonList = {};
for (let item in keyLetters) {
    buttonList[item] = new CharButton(item, keyLetters[item], buttonsContainer, actionHandler);
}

document.addEventListener('keydown', (event)=> {
    if (event.code in buttonList) {
        console.log(event.code);
        buttonList[event.code].action(event);
    }
});

'use strict';

let appConfig = {};

class CharButton {
    constructor(key, char, containerEl, actionHandler) {
        this.key = ''+key;
        this.char = char.toUpperCase().trim()[0];
        this.id = 'button-'+this.key;
        this.el = document.createElement('button');
        this.el.innerText = this.char;
        this.el.id = this.id;
        this.el.className = 'btn btn-info key-button';
        this.el.setAttribute('type','button');
        this.el.setAttribute('char', this.char);
        this.el.setAttribute('key', this.key);
        this.actionHandler = actionHandler;
        containerEl.appendChild(this.el);
        this.action = (e)=>{
            //console.log(`${this.char}`);
            mainDisplay.innerText = '...';
            if (!this.isBusy) {
                this.isBusy = true;
                this.el.classList.add('selected');
                setTimeout(()=>this.getNum(),1000);
            } else {
                this.el.classList.add('isbusy');
                setTimeout(()=>this.el.classList.remove('isbusy'),500);
            }
        }; //action
        this.el.addEventListener('click', this.action);
        this.isBusy = false;
    }//constructor

    getNum() {
        fetch(`/getnum/${this.char}`)
            .then((response) => {
                return response.json();
            })
            .then((resJson) => {
                console.log(JSON.stringify(resJson));
                this.actionHandler(resJson['result']);
                this.el.classList.remove('selected');
                this.isBusy = false;
            })
            .catch(error => console.error('Error:', error));
    }//getNum

    callHandler() {
        this.actionHandler(this.char);
    }//callHandler
} //class CharButton

const mainDisplay = document.getElementById('main-display');
const range = document.createRange();
const resultsList = document.getElementById('results-list');

mainDisplay.innerText = 'Нажмите клавишу с первой буквой фамилии пациента...';

const actionHandler = (inNum) => {
    //console.log(`actionHandler(${inChar})`);
    let result = (''+inNum).trim();
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
    li.setAttribute('id',result);
    //li.className = 'list-group-item';
    for (let item of resultsList.querySelectorAll('button')) {
        item.classList.remove('btn-success');
        item.classList.add('btn-outline-success');
    }
    let date = new Date();
    li.innerHTML = `<div class="item-container">
        <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Номер получен ${date.toLocaleString("ru")}">${result}</button>
        <button type="button" class="btn btn-outline-success" data-toggle="tooltip" data-placement="top" title="Освободить номер">x</button>
     </div>`;
    resultsList.insertBefore(li, resultsList.children[0]);
    li.addEventListener('click', actionFreeNum);
    setTimeout(freeNum, appConfig['reservationTimeout'], li);
};//actionHandler

const freeNum = (item) => {
    console.log('freeNum - '+item.getAttribute('id'));
    //We should ask server to free the number
    fetch(`/freenum/${item.getAttribute('id')}`)
        .then((response) => {
            return response.json();
        })
        .then((resJson) => {
            console.log(JSON.stringify(resJson));
            item.remove();
        })
        .catch(error => console.error('Error:', error));
};//freeNum

const actionFreeNum = (event)=>{
    const item = event.target.closest('li');
    freeNum(item);
};//actionFreeNum

class Keyboard {
    constructor(keySet, containder) {
    }
}

const displayContainer = document.getElementById('keycode-container');
const buttonsContainer = document.getElementById('buttons-container');
const buttonList = {};
fetch('/getconfig')
    .then(function(response) {
         return response.json();
    })
    .then(function(config) {
        //const keyLetters = configJson;
        appConfig = config;
        let keyLetters = appConfig.keyLetters;
        console.log(appConfig);
        for (let item in keyLetters) {
            buttonList[item] = new CharButton(item, keyLetters[item], buttonsContainer, actionHandler);
        }

        document.addEventListener('keydown', (event)=> {
            if (event.code in buttonList) {
                console.log(event.code);
                buttonList[event.code].action(event);
            }
        });
    }).catch(error => console.error('Error:', error));

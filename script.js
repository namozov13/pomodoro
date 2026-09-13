const settingsBtn = document.getElementById('settingsBtn');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeBtn = document.getElementById('closeBtn')

const showModal = () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const hideModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

settingsBtn.addEventListener('click', showModal);
overlay.addEventListener('click', hideModal);
closeBtn.addEventListener('click', hideModal);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal()
})

const timeSettings = {
    pomodoro: 1800,
    short: 600,
    long: 1500,
};

let tempTime = {
    pomodoro: timeSettings.pomodoro,
    short: timeSettings.short,
    long: timeSettings.long
};


const themes = {
    color: 'colorRed',
    font: 'kumbhSans'
};

let tempTheme = {
    color: themes.color,
    font: themes.font
};



const pomodoroInput = document.getElementById('pomodoro');
const shortInput = document.getElementById('shortBreak');
const longInput = document.getElementById('longBreak');


pomodoroInput.value = tempTime.pomodoro / 60;
shortInput.value = tempTime.short / 60;
longInput.value = tempTime.long / 60;

const inpFunc = (inp, inpName) => {
    inp.addEventListener('input', () => {
        let val = inp.value;
        if (val < 0 || isNaN(val)) {
            inp.value = 0;
        } else if (inp.value == "") {
            inp.value = 0;
        } else if (inp.value == 0 && val.length > 1) {
            inp.value = 0;
        } else if (val.length > 2) {
            inp.value = 99;
        }
        tempTime[inpName] = inp.value * 60;
    })
}

inpFunc(pomodoroInput, 'pomodoro');
inpFunc(shortInput, 'short');
inpFunc(longInput, 'long');

const body = document.querySelector('body');

const updateUI = () => {
    body.classList.remove('colorRed', 'colorTurqoise', 'colorLavender');
    body.classList.add(themes.color);
    body.classList.remove('kumbhSans', 'robotoSlab', 'spaceMono');
    body.classList.add(themes.font);
};

updateUI();

const applyBtn = document.getElementById('applyBtn');


applyBtn.addEventListener('click', () => {
    const active = document.querySelector('.typeform input:checked').dataset.value;
    themes.color = tempTheme.color;
    themes.font = tempTheme.font;
    updateUI();
    timeSettings.pomodoro = tempTime.pomodoro;
    timeSettings.short = tempTime.short;
    timeSettings.long = tempTime.long;
    updateTime(active);
    clearInterval(myInterval);
    progress = false;
    hideModal();
    timeText.innerHTML = 'start';

});


const fontRadios = document.querySelectorAll('.logo.font input');
let fontChecked = document.querySelector('.logo.font input:checked');

fontRadios.forEach(rad => {
    rad.addEventListener('change', () => {
        fontChecked = document.querySelector('.logo.font input:checked');
        tempTheme.font = fontChecked.dataset.fontname;
    })
    
});

const colorRadios = document.querySelectorAll('.logo.color input');
let colorChecked = document.querySelector('.logo.color input:checked');

colorRadios.forEach(col => {
    col.addEventListener('change', () => {
        colorChecked = document.querySelector('.logo.color input:checked');
        tempTheme.color = colorChecked.dataset.colorname;
    })
});



let total;
const radios = document.querySelectorAll('.typeform input');
const timeSpans = document.querySelectorAll('.time span');

const renderTime = (secondsTotal) => {
    const minute = String(Math.floor(secondsTotal / 60)).padStart(2, '0');
    const second = String(secondsTotal % 60).padStart(2, '0');
    timeSpans[0].innerHTML = minute;
    timeSpans[2].innerHTML = second;
};

const updateTime = (activeType) => {
    total = timeSettings[activeType];
    renderTime(total);
};

updateTime('pomodoro')

radios.forEach(input => {
    input.addEventListener('change', () => {
        const value = input.dataset.value;
        clearInterval(myInterval);
        updateTime(value);
        timeText.innerHTML = 'start'
        progress = false;
    });
});

const mainDiv = document.querySelector('.main-div');
const timeText = document.querySelector('.timeText');
let progress = false;
const startSound = new Audio('./media/start.mp3');
const switchSound = new Audio('./media/switch.mp3');
const complatedSound = new Audio('./media/complated.mp3');



let myInterval = null;


mainDiv.addEventListener('click', () => {

    if (progress === false) {
        progress = true;
    } else {
        progress = false;
    }

    startSound.play();

    const activeRadio = document.querySelector('.typeform input[name="break"]:checked');
    const activeValue = activeRadio ? activeRadio.dataset.value : 'pomodoro';

    if (progress) {
        timeText.innerHTML = 'pause';
        myInterval = setInterval(() => {
            if (total < 0) {
                renderTime(total);
                complatedSound.play();
                progress = false;
                timeText.innerHTML = 'start';
                clearInterval(myInterval);
                total = timeSettings[activeValue];
                renderTime(total);
            } else {
                renderTime(total);
                total -= 1;
            }
        }, 1000);
    } else {
        clearInterval(myInterval);
        timeText.innerHTML = 'start'
    }
});

const label = document.querySelectorAll('.typeform label p');

label.forEach(label => {
    label.addEventListener('click', () => {
        switchSound.play();
    });
});

const ups = document.querySelectorAll('.upArrow');
const downs = document.querySelectorAll('.downArrow');

const numBtnFunc = (nodeList, plusminus) => {
    nodeList.forEach((nodeItem) => {
        nodeItem.addEventListener('click', () => {
            let val = Number(nodeItem.parentElement.parentElement.querySelector('input').value);
            if (plusminus === '+' && val < 99) {
                nodeItem.parentElement.parentElement.querySelector('input').value = String(val + 1);
                tempTime[nodeItem.parentElement.parentElement.querySelector('input').dataset.name] = Number(nodeItem.parentElement.parentElement.querySelector('input').value) * 60;
            } else if (plusminus === '-' && val > 0) {
                nodeItem.parentElement.parentElement.querySelector('input').value = String(val - 1);
                tempTime[nodeItem.parentElement.parentElement.querySelector('input').dataset.name] = Number(nodeItem.parentElement.parentElement.querySelector('input').value) * 60;
            }
        })
    })
};

numBtnFunc(ups, '+');
numBtnFunc(downs, '-');
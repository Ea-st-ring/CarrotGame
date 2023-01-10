'use strict'

const play_btn = document.querySelector('.fa-play-circle');
const pause_btn = document.querySelector('.fa-stop-circle');
const background = document.querySelector('#background');
const timeText = document.querySelector('.time_text');
const body = document.querySelector('body');
const itemBox = document.querySelector('.itemBox');
const countText = document.querySelector('.count_text');
const popUp = document.querySelector('.pop_up');
const result = document.querySelector('.pop_up_result');
const replay_btn = document.querySelector('.fa-redo');
const bgm = new Audio(); // Audio 객체 생성
const bugSound = new Audio();
const carrotSound = new Audio();
const winSound = new Audio();

bgm.src = "carrot/sound/bg.mp3";
bugSound.src = "carrot/sound/bug_pull.mp3";
carrotSound.src = "carrot/sound/carrot_pull.mp3";
winSound.src = "carrot/sound/game_win.mp3";

let count = 10;
let isPaused = false;
let countInterval;

const clientRect = background.getBoundingClientRect();

const clientLeft = clientRect.left + 30;
const clientRight = clientRect.right - 80;
const clientTop = clientRect.top + 398;
const clientBottom = clientRect.bottom - 110;

play_btn.addEventListener('click',()=>{
    onStart();
});

pause_btn.addEventListener('click',()=>{
    onPause();
    
});



function onStart(){
    playSound(bgm);
    count = 10
    isPaused = false;
    play_btn.style.display='none';
    pause_btn.style.display='block';
    countText.innerHTML = count;
    popUp.style.display = 'none';
    replay_btn.removeAttribute('disabled');

    pause_btn.addEventListener('click',()=>{
        // 초기화 함수
        pause_btn.style.display='none';
        play_btn.style.display='block';
    });

    createItem('bug',10);
    createItem('carrot',10);
    counter(10);
}

function onPause(){
    bgm.pause();
    isPaused = true;
    count = 10;
    countText.innerHTML = count;
    stopCounter(10);
    // 요소들 제거 함수
    clearGround();
}


function onWin(){
    stopSound(bgm);
    playSound(winSound);
    clearGround();
    pause_btn.style.display='none';
    play_btn.style.display='block';
    countText.innerHTML = count;
    result.innerHTML = 'You win!';
    popUp.style.display = 'flex';
    replay_btn.removeAttribute('disabled');


    replay_btn.addEventListener('click',(e)=>{
        popUp.style.display ='none';
    
        if(!e.target.hasAttribute('disabled')){
            onStart();
        }

        e.target.setAttribute("disabled",true);
    });
}



function onLose(){
    stopSound(bgm);
    pause_btn.style.display='none';
    play_btn.style.display='block';
    countText.innerHTML = count;
    result.innerHTML = 'Lose!';
    popUp.style.display = 'flex';
    replay_btn.removeAttribute('disabled');


    replay_btn.addEventListener('click',(e)=>{
        popUp.style.display ='none';
    
        if(!e.target.hasAttribute('disabled')){
            onStart();
        }

        e.target.setAttribute("disabled",true);
    });

}

function createItem(className, count) {
    
    for (let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('src',`carrot/img/${className}.png`);
        item.classList.add(className);
        
        const x = randomNumber(clientLeft, clientRight);
        const y = randomNumber(clientBottom, clientTop);
        
        item.style.position = 'absolute';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        itemBox.appendChild(item);

    }

    itemBox.addEventListener('click', e => {
        if(!e.target.hasAttribute('disabled') || !e.target.getAttribute('disabled')){
            (e.target.className=='carrot') ? removeItem(e.target) : removeItem(null);
        }       
        e.target.setAttribute("disabled",true);    
    });
    
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function counter(time){
    let secondsRemaining = time - 1;
    let sec = time;

    countInterval = setInterval(function () {
        if(!isPaused && secondsRemaining>10){
            timeText.textContent = `00:${secondsRemaining}`;
        } else if(!isPaused) {
            timeText.textContent = `00:0${secondsRemaining}`;
        }
        if (secondsRemaining < 0 || isPaused){
            clearInterval(countInterval);
            clearGround(); 
            onLose();
            timeText.textContent = `00:${sec}`;
        };
        secondsRemaining = secondsRemaining - 1;
    }, 1000);
}

function stopCounter(time){
    clearInterval(countInterval);
    timeText.textContent = `00:${time}`;
}

// itemBox를 통해 제거하는 것으로 개선 필요
function clearGround(){
    const bugs = document.querySelectorAll('.bug');
    const carrots = document.querySelectorAll('.carrot');
    bugs.forEach((target)=>{
        target.remove();
    });
    carrots.forEach((target)=>{
        target.remove();
    });
}

function removeItem(item){
    if(item!=null){
        playSound(carrotSound);
        item.remove();
        countText.innerHTML = --count;
        if(count==0){
            stopCounter(10);
            onWin();
        }
    } else{
        playSound(bugSound);
        onPause();
        onLose();
    }
}


function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}
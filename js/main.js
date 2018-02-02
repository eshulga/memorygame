const game = {

fieldSize: 4,
field: document.getElementById('game'),
fieldArray: [],

control: document.getElementById('control'),
//ходы
moves:{
    total: 0, //всего за игру
    totalWrap: document.getElementById('total'),
    right: 0, //правильных попыток
    currentVals: [], //текущие значения
    currentTabs: [], //текущие плиточки
},

animations: {

    rotate : function( elem ){
        elem.classList.add('rotate');
        setTimeout(function(){
            elem.classList.remove('rotate');
        }, 500);
    },

    fadeIn : function( elem ){
        elem.classList.add('fadeIn');
    },

    fadeOut : function( elem ){
        elem.classList.remove('fadeIn');
    },
    shake: function( elem ){
        elem.classList.add('shake');
        setTimeout(()=>{
            elem.classList.remove('shake');
        }, 500)
    }
},

timer: {
    min: 0,
    sec: 0,
    msec: 0,
    wrapper: document.getElementById('timer'),
    start: function(){

        this.gameTimer = setInterval(()=>{

            this.msec++;

            if(this.msec == 100){
                this.sec++;
                this.msec = 0;
            }

            if(this.sec == 60){
                this.min++;
                this.sec = 0;
            }
            
            const min = this.min < 10 ? `0${this.min}` : this.min === 0 ? '00' : this.min;
            const sec = this.sec < 10 ? `0${this.sec}` : this.sec === 0 ? '00' : this.sec;
            const msec = this.msec < 10 ? `0${this.msec}` : this.msec;

            this.wrapper.innerHTML = `Time <span>${min}</span>:<span>${sec}</span>:<span>${msec}</span>`;

        }, 10);
    },
    stop: function(){
        clearInterval(this.gameTimer);
    }
},

shuffle: function(arr) {

    var m = arr.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }

    return arr;
},

createUniqArray: function(){

    let arr = [];

    for(let i = 1; i <= this.fieldSize*2; i++){
        arr.push(i,i)
    }

    this.fieldArray = this.shuffle(arr);

    return this;
},

renderField: function(){

    this.control.style.display = 'none';
    this.field.innerHTML = '';
    this.moves.totalWrap.innerHTML=`Total: 0`;
    this.moves.total = 0;
    this.moves.right = 0;
    this.timer.wrapper.innerHTML = 'Timer <span>00</span>:<span>00</span>:<span>00</span>';
    this.timer.min = 0;
    this.timer.sec = 0;
    this.timer.msec = 0;
    
    let elements = `<div class="row">`;

    this.fieldArray.forEach((element, i) => {
        
        elements += `<div class="tab" data-val="${element}"><div class="tab__value">${element}</div></div>`;

        if((i+1)%this.fieldSize==0 && (i+1) !== this.fieldArray.length){
            elements += `</div><div class="row">`;
        }

    });

    elements += `</div>`;

    this.field.insertAdjacentHTML('afterbegin', elements);

    this.bindCLicks();
},

resetMoves: function(){
    
    this.moves.total++
    this.moves.currentTabs = [];
    this.moves.currentVals = [];

    this.updateTotals();
},

updateTotals: function(){
    const total = this.moves.total;
    this.moves.totalWrap.innerHTML=`Total: ${total}`;
},
//проверка хода
checkMoves: function(){

    if(this.moves.currentVals.length === 2){
    //верный выбор
        const currentVals = this.moves.currentVals;
        const currentTabs = this.moves.currentTabs;
        
        if(currentVals[0] === currentVals[1]){

            this.moves.right++;

            if(this.moves.right === this.fieldSize*2){
                this.timer.stop();
                this.control.style.display = 'block';
            }

            this.resetMoves();
    } else {
    // не верный выбор
            currentTabs.forEach((openetTab)=>{
                this.animations.shake(openetTab);
            })

            setTimeout(()=>{ 
                currentTabs.forEach((openetTab)=>{
                    this.animations.fadeOut(openetTab);
                })
            }, 700);
            
            this.resetMoves();
        }
    }
},

bindCLicks: function(){

    this.field.addEventListener('click', (e)=>{

        if(!e.target.classList.contains('fadeIn') && e.target.classList.contains('tab__value')){
            
            if(this.moves.total === 0 && this.moves.currentVals.length === 0){
                this.timer.start();
            }

            let tabInner = e.target;
            let tab = tabInner.parentNode;
    
            this.animations.rotate(tab);
            this.animations.fadeIn(tabInner);
    
            this.moves.currentVals.push(tab.dataset.val);
            this.moves.currentTabs.push(tabInner);
    
            this.checkMoves();
        }
    })
},

run: function(){

    this.createUniqArray()
        .renderField();
    
        console.log(this.fieldArray)
}

};

var runGame = ()=>{
    let newGame = game;
    newGame.run();
}

runGame();
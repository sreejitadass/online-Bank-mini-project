'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2020-04-01T10:17:24.185Z',
      '2020-05-08T14:11:59.604Z',
      '2020-05-27T17:01:17.194Z',
      '2020-07-11T23:36:17.929Z',
      '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2024-02-27T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2024-02-24T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements=(function(acc,sort=false){
    const movs=sort? acc.movements.slice().sort((a,b)=>a-b):acc.movements;

    containerMovements.innerHTML='';

    movs.forEach(function(mov,i){

    const type=(mov>0)?'deposit':'withdrawal';

    const formatDate1=formatDates(new Date(acc.movementsDates[i]));

    const html=`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${formatDate1}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin',html);
    });
});

//displayMovements(account1.movements);

const createUsernames = function(accounts){

    accounts.forEach(function(accounts){
        accounts.username=accounts.owner.toLowerCase().split(' ').map(
        function(word){
            return word[0];
        }).join('');
    })
}
createUsernames(accounts);
console.log(accounts);

const updateUI = function(currAcc){
    displayMovements(currAcc);
    calcBalance(currAcc);
    calcSummary(currAcc);
}


const calcBalance = function(accounts){
    accounts.balance=accounts.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent=`${accounts.balance}€`;
}
//calcBalance(account1.movements);

const calcSummary=function(accounts){
    const income=accounts.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov);
    labelSumIn.textContent=`${income}€`;

    const out=accounts.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov);
    labelSumOut.textContent=`${Math.abs(out)}€`;

    const interest=accounts.movements.filter(mov=>mov>0).map(deposit=>(deposit*accounts.interestRate)/100).filter(int=>int>=1).reduce((acc,int)=>acc+int,0);
    labelSumInterest.textContent=`${interest}€`;
}

const formatDates = function (dateRec) {
    const date = new Date(dateRec);
    const dateDay = `${date.getDate()}`.padStart(2, 0);
    const dateMonth = `${date.getMonth() + 1}`.padStart(2, 0); // Add 1 to month because getMonth() returns zero-based month index
    const dateYear = `${date.getFullYear()}`;

    let formatDate;

    const daysPassed = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
    if (daysPassed(new Date(), date) === 0)
        formatDate = `Today`;
    else if (daysPassed(new Date(), date) === 1)
        formatDate = `Yesterday`;
    else if (daysPassed(new Date(), date) <= 7)
        formatDate = `${daysPassed(new Date(), date)} days ago`;
    else
        formatDate = `${dateDay}/${dateMonth}/${dateYear}`;
    return formatDate;
}


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// EVENT HANDLERS

//SET DATE
const nowDate=new Date();
const options={
    hour:'numeric',
    minute:'numeric',
    day:'numeric',
    month:'long',
    year:'numeric',
    weekday:'long',
};

/*const nowDay=`${nowDate.getDate()}`.padStart(2,0);
const nowMonth=`${nowDate.getMonth()}`.padStart(2,0);
const nowYear=`${nowDate.getFullYear()}`
const nowHour=`${nowDate.getHours()}`.padStart(2,0);
const nowMins=`${nowDate.getMinutes()}`.padStart(2,0);
labelDate.textContent=`${nowDay}/${nowMonth}/${nowYear},${nowHour}:${nowMins}`;*/

//internationalizing dates
labelDate.textContent=new Intl.DateTimeFormat('en-GB',options).format(nowDate);

let currAcc;

//LOGIN 
btnLogin.addEventListener('click',function(e){
    e.preventDefault();

    currAcc=accounts.find(acc=>acc.username===inputLoginUsername.value);

    //?-->it will check if currAcc exists(optional chaining)
    if(currAcc.pin===Number(inputLoginPin.value)){

        labelWelcome.textContent=`Welcome back, ${currAcc.owner.split(' ')[0]}`;
        containerApp.style.opacity=100;

        updateUI(currAcc);

        //clear fields
        inputLoginPin.value=inputLoginUsername.value='';
        inputLoginPin.blur();
        inputLoginUsername.blur();
    }
});

//TRANSFER
btnTransfer.addEventListener('click',function(e){
    e.preventDefault();

    const transferAmt=Number(inputTransferAmount.value);
    const transferTo=accounts.find(acc=>acc.username===inputTransferTo.value);

    //check if valid transfer
    if(transferAmt>0 && transferTo && currAcc.balance>=transferAmt && transferTo?.username!==currAcc.username){
        currAcc.movements.push(-transferAmt);
        transferTo.movements.push(transferAmt);

        updateUI(currAcc);

        //clear fields
        inputTransferAmount.value=inputTransferTo.value='';
        inputTransferAmount.blur();
        inputTransferTo.blur();
    }
});

//LOAN
btnLoan.addEventListener('click',function(e){
    e.preventDefault();

    const loanAmt=Number(inputLoanAmount.value);

    //if loan amount>0 and atleast 1 movement is > 10% of loan amount
    if(loanAmt>0 && currAcc.movements.some(mov=>mov>=loanAmt*0.1)){
        setTimeout(function(){
            currAcc.movements.push(loanAmt);

            updateUI(currAcc);
    
            inputLoanAmount.value='';
            inputLoanAmount.blur();
        },2000);
    }
})

//CLOSE ACCOUNT
btnClose.addEventListener('click',function(e){
    e.preventDefault();

    if(currAcc.username===inputCloseUsername.value && currAcc.pin===Number(inputClosePin.value)){

        const delIndex=accounts.findIndex(acc=>acc.username===currAcc.username);
        accounts.splice(delIndex,1);

        //hide UI
        containerApp.style.opacity=0;

        //clear fields
        inputClosePin.value=inputCloseUsername.value='';
        inputClosePin.blur();
        inputCloseUsername.blur();
    }
});

//LOGOUT TIMER
const logoutTimer=setTimeout(function(){
    let time=300;   //5 mins

    const timer1=setInterval(function(){
        let min=`${Math.trunc(time/60)}`.padStart(2);
        let sec=`${Math.trunc(time%60)}`.padStart(2);
        labelTimer.textContent=`${min}:${sec}`;
        time=time-1;

        if(time==0){
            clearInterval(timer1);

            labelWelcome.textContent="Log in to get started";
            containerApp.style.opacity=0;
        }
    },1000);
})

//SORT MOVEMENTS
let sorted=false;
btnSort.addEventListener('click',function(e){
    e.preventDefault();
    displayMovements(currAcc,true);
    sorted=!sorted;

});



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURE PRACTICE

// const deposits=account1.movements.filter(function(mov){
//     return mov>0;
// });
// console.log(deposits);

// const depositsFor=[];
// for(const mov of account1.movements){
//     if(mov>0){
//         depositsFor.push(mov);
//     }
// }
// console.log(depositsFor);

/*const balance=account1.movements.reduce(function(acc,cur,i,arr){
    return acc+cur;
},0 //initial value of accumuluator acc
)
console.log(balance);

const max=account1.movements.reduce(function(acc,mov,i,arr){
    if(acc>mov)
        return acc;
    else
        return mov;
},account1.movements[0]);
console.log(max);

//chaining map,filter,reduce array methods
const eurToUSD=1.1;
// const totalDepositsUSD=account1.movements.filter=(function(mov){
//     return mov>0;
// }.map=function(mov){
//     return mov*eurToUSD;
// }.reduce=function(acc,mov){
//     return acc+mov;
// },0);

//convert to arrow function(correct syntax)
const totalDepositsUSD=account1.movements.filter(mov=>mov>0).map(mov=>mov*eurToUSD).reduce((acc,mov)=>acc+mov,0);
console.log(totalDepositsUSD);

//find method-->returns element         filter method-->returns new array
const account=accounts.find(acc=>acc.owner==="Jessica Davis");
console.log(account);

//flattening array
const arr=[[1,2],[3,4,5,6],7,8,[9,10]];
console.log(arr.flat());

const arrDeep=[[[1,2]],[3,4,5,6],7,8,[[[9,10]]]];
console.log(arrDeep.flat(3));    //default value of level of nesting() -->1

//map() will create an array of nested movement arrays
const accMovements=accounts.map(acc=>acc.movements);
const overAllMovements=accMovements.flat();
console.log(overAllMovements);

let overAllBalance=accounts.map(acc=>acc.movements).flat().reduce((acc,mov)=>acc+mov);
console.log(overAllBalance);

//map+flat=flatMap
overAllBalance=accounts.flatMap(acc=>acc.movements).reduce((acc,mov)=>acc+mov);
console.log(overAllBalance);

//sort
//ascending
/*account1.movements.sort((a,b)=>{
    if (a>b) return 1;
    if(a<b) return -1;
});
account1.movements.sort((a,b)=>a-b);
console.log(account1.movements);

//descending
// account1.movements.sort((a,b)=>{
//     if (a>b) return -1;
//     if(a<b) return 1;
// });
account1.movements.sort((a,b)=>b-a);
console.log(account1.movements);

//array methods(creating)
const arr1=[1,2,3,4,5,6,7,8,9,10];
const arr2=new Array(7);

//fill
arr2.fill(9);
arr1.fill(4,3,7);   //(no,begin,end)
console.log(arr1);
console.log(arr2);

//from
const x = Array.from({length:6},()=>8);
console.log(x);

const y=Array.from({length:10},(_,i)=>i+1);
console.log(y);

//using from to create from UI
let movementsUI;
labelBalance.addEventListener('click',function(){
    movementsUI=Array.from(document.querySelectorAll('.movements__value'));
})

console.log(movementsUI.map(el=>el.textContent.replace('€',' ')));*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ARRAYS METHOD PRACTICE

//1. find total deposit sum in bank
const allDepositsBank=accounts.flatMap(acc=>acc.movements).filter(mov=>mov>0).reduce((sum,mov)=>sum+mov,0);
console.log(allDepositsBank);

//2. how many deposits with atleast 1000$
let numDeposits=accounts.flatMap(acc=>acc.movements).filter(mov=>mov>=1000).length;
console.log(numDeposits);
//OR
numDeposits=accounts.flatMap(acc=>acc.movements).reduce((count,cur)=>((cur>=1000)?count+1:count),0);
console.log(numDeposits);

//3. create a new object which contains sum of deposits and sum of withdrawals
// const {deposits,withdrawals}=accounts.flatMap(acc=>acc.movements).reduce((sum,cur)=>{
//     cur>0?sum.deposits+=cur:sum.withdrawals+=Math.abs(cur)
// },
// {deposits:0,withdrawals:0});
//console.log(deposits,withdrawals);

//4. convert string to title case
const convertTitleCase = function(title){
    const titleCase = (title.toLowerCase().split(' ').map(word=>word[0].toUpperCase()+word.slice(1)).join(' '));
    return titleCase;
}
console.log(convertTitleCase("i am BUBU"));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// NUMBERS

//string to number
console.log(Number('89'));  //or, (+'89')

console.log(Number.parseInt('4px'));
console.log(Number.parseInt('9.7rem'));
console.log(Number.parseInt('xyz45'));

console.log(Number.parseFloat('4px'));
console.log(Number.parseFloat('9.7rem'));

//check if not a no
console.log(Number.isNaN(67/0));
console.log(Number.isNaN(90));
console.log(Number.isNaN('8'));
console.log(Number.isNaN(+'9'));

//check if finite
console.log(Number.isFinite(67/0));
console.log(Number.isFinite(+'9'));

//math functions
console.log(Math.sqrt(25));
console.log(25**(1/2));

console.log(Math.max(9,5,6,7,12));
console.log(Math.max(9,5,6,7,'12'));
console.log(Math.max(9,5,6,7,'12px'));

console.log(Math.random()); //random no b/w 0 and 1

const randomInteger = (min,max)=>Math.trunc(Math.random()*(max-min));
console.log(randomInteger(20,30));

//round,ceil,floor-->same
//fixed
console.log((3.567).toFixed(2));
console.log((4.5).toFixed(3));

//Remainder operator
labelBalance.addEventListener('click',function(){
    [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
        if(i%2==0)
            row.style.backgroundColor='orangered';
        else
            row.style.backgroundColor='blue';
    })
});

//creating dates
let now=new Date();
console.log(now);

console.log(new Date(account2.movementsDates[0]));

console.log(new Date('September 16,2004'));
console.log(new Date('2016, 6, 11'));

//methods
console.log(now.getFullYear());
console.log(now.getMonth()+1);
console.log(now.getDate());
console.log(now.getDay());  //day of week
console.log(now.getHours());
console.log(now.getMinutes());
console.log(now.getSeconds());
console.log(now.getTime()); //time in ms since Jan 1,1970(same as Number(date) or +date)
console.log(now.toISOString());
console.log(new Date(1709097274484));
console.log(now.getFullYear(now.setFullYear(2025)));

//operation--> find days passed b/w 2 dates
const daysPassed=((date1,date2)=>Math.abs(date1-date2)/(1000*60*60*24));    //convert to days from ms
const days1 = daysPassed(new Date(2024,3,16),new Date(2024,3,8));
console.log(days1); 

//timers
// setTimeout((name)=>console.log(`Hello ${name}!`),5000,`Sreejita`);
// console.log("Waiting...");

// const ingredients=['olives','spinach'];
// const pizzaTimer=setTimeout((ing1,ing2)=>console.log(`Here is your pizza with ${ing1} and ${ing2}`),3000,...ingredients);
// if(ingredients.includes('olives')){
//     clearTimeout(pizzaTimer);
// }

//create actual clock using setInterval
setInterval(function(){
    now=new Date();
    console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`); 
 },1000);
 
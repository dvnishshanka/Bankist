'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    { val: 200, date: '2019-11-18T21:31:17.178Z' },
    { val: 450, date: '2019-12-23T07:42:02.383Z' },
    { val: -400, date: '2020-01-28T09:15:04.904Z' },
    { val: 3000, date: '2020-04-01T10:17:24.185Z' },
    { val: -650, date: '2020-05-08T14:11:59.604Z' },
    { val: -130, date: '2020-05-27T17:01:17.194Z' },
    { val: 70, date: '2023-06-05T10:51:36.790Z' },
    { val: 300, date: '2023-06-08T23:36:17.929Z' },
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { val: 5000, date: '2019-11-01T13:15:33.035Z' },
    { val: 3400, date: '2019-11-30T09:48:16.867Z' },
    { val: -150, date: '2019-12-25T06:04:23.907Z' },
    { val: -790, date: '2020-01-25T14:18:46.235Z' },
    { val: -3210, date: '2020-02-05T16:33:06.386Z' },
    { val: -1000, date: '2020-04-10T14:43:26.374Z' },
    { val: 8500, date: '2020-06-25T18:49:59.371Z' },
    { val: -30, date: '2020-07-26T12:01:20.894Z' },
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [
    { val: 5000, date: '2019-11-01T13:15:33.035Z' },
    { val: 3400, date: '2019-11-30T09:48:16.867Z' },
    { val: -150, date: '2019-12-25T06:04:23.907Z' },
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [
    { val: 5000, date: '2019-11-01T13:15:33.035Z' },
    { val: 3400, date: '2019-11-30T09:48:16.867Z' },
    { val: -150, date: '2019-12-25T06:04:23.907Z' },
    { val: -790, date: '2020-01-25T14:18:46.235Z' },
    { val: -3210, date: '2020-02-05T16:33:06.386Z' },
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

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

let currentAccount, timer;

const createUsernames = acc => {
  acc.forEach(account => {
    const usernameArr = account.owner
      .toLowerCase()
      .split(/\s+/)
      .map(name => name.at(0));
    account.username = usernameArr.join('');
  });
};

const formatCurrency = (currency, locale, val) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    locale,
  }).format(val);
};

const formatDate = (dateStr, locale) => {
  const newDate = new Date(dateStr);

  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));
  };

  const daysPassed = calcDaysPassed(Date.now(), newDate);

  if (daysPassed === 0) return 'TODAY';
  if (daysPassed === 1) return `YESTERDAY`;
  if (daysPassed <= 7) return `${daysPassed} DAYS AGO`;

  // const date = `${newDate.getDate()}`.padStart(2, '0');
  // const year = newDate.getFullYear();
  // const month = `${newDate.getMonth() + 1}`.padStart(2, '0');
  // return `${date}/${month}/${year}`;

  // Another method using Intl and locale to format date
  return Intl.DateTimeFormat(locale).format(newDate);
};

const startLogoutTimer = () => {
  let time = 120;

  const tick = () => {
    if (time === 0) {
      labelWelcome.innerText = 'Log in to get started';
      containerApp.style.opacity = '0';
      clearInterval(timer);
    }
    const min = Math.trunc(time / 60);
    const sec = time % 60;

    time--;
    labelTimer.textContent = `${String(min).padStart(2, '0')}:${String(
      sec
    ).padStart(2, '0')}`;
  };

  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const movementsArr = sort
    ? acc.movements.slice(0).sort((a, b) => a.val - b.val)
    : acc.movements;
  movementsArr.forEach((mov, i) => {
    const type = mov.val < 0 ? 'withdrawal' : 'deposit';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${formatDate(mov.date, acc.locale)}</div>
        <div class="movements__value">${formatCurrency(
          acc.currency,
          acc.locale,
          mov.val
        )}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov.val, 0);
  labelBalance.textContent = `${formatCurrency(
    acc.currency,
    acc.locale,
    acc.balance
  )}`;

  // const newDate = new Date();
  // const date = `${newDate.getDate()}`.padStart(2, '0');
  // const year = newDate.getFullYear();
  // const month = `${newDate.getMonth() + 1}`.padStart(2, '0');
  // const hour = `${newDate.getHours()}`.padStart(2, '0');
  // const minute = `${newDate.getMinutes()}`.padStart(2, '0');

  // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;

  // Another method
  const options = {
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
  };
  labelDate.textContent = Intl.DateTimeFormat(acc.locale, options).format(
    new Date()
  );
};

const calcDisplaySummary = acc => {
  const totalDeposits = acc.movements
    .filter(mov => mov.val > 0)
    .reduce((acc, mov) => acc + mov.val, 0);
  labelSumIn.innerText = `${formatCurrency(
    acc.currency,
    acc.locale,
    totalDeposits
  )}`;

  const totalWithdrawals = acc.movements
    .filter(mov => mov.val < 0)
    .reduce((acc, mov) => acc + mov.val, 0);
  labelSumOut.innerText = `${formatCurrency(
    acc.currency,
    acc.locale,
    -totalWithdrawals
  )}`;

  const interest = (totalDeposits * acc.interestRate) / 100;
  labelSumInterest.innerText = `${formatCurrency(
    acc.currency,
    acc.locale,
    interest
  )}`;
};

const updateUI = acc => {
  displayBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  currentAccount = accounts.find(
    acc => acc.username === username && acc.pin === pin
  );

  if (currentAccount) {
    labelWelcome.innerText = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';
    inputLoginUsername.value = inputLoginPin.value = '';

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    transferTo.username !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    transferTo.movements.push({ val: amount, date: new Date() });
    currentAccount.movements.push({ val: -amount, date: new Date() });

    updateUI(currentAccount);

    // Reset Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const indexOfCurrentUser = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(indexOfCurrentUser, 1);
    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.innerText = 'Log in to get started';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => loanAmount <= mov.val * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push({ val: loanAmount, date: new Date() });
      updateUI(currentAccount);

      // Reset Timer
      if (timer) clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
});

let sorted = false;
btnSort.addEventListener('click', () => {
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
createUsernames(accounts);

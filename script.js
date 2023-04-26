const form = document.querySelector('.todo-form');
const alert = document.querySelector('.alert');
const todoInput = document.querySelector('#todo-inpt');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const list = document.querySelector('.todo-list');
const main = document.querySelector('.main')

// --------------------------------------------------------

let editElement;
let editSwitch = false;
let editID = '';
let inputNumber = false;
let numbers = '';
let letters = '';
let checkBox = false;


form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', loadItems);
main.addEventListener('click', selected)

// ------------------------- 할일 추가, 변경, 제거 시 호출할 함수들

function addItem(e) {
  e.preventDefault();
  let value = todoInput.value;
  const id = new Date().getTime().toString();
  if (value !== '' && !editSwitch) {
    if (/^\d{8}[^\d]+$/.test(value)) {
      extract(value);
      value = letters;
      inputNumber = true;
    }
    const element = document.createElement('li');
    let attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add('todo-item');
    element.innerHTML = `
    <div class="deadline"></div>
      <p class="title">${value}</p>
      <div class="btn-container">
          <button class="edit-btn">
              <i class="edit"></i>
          </button>
          <button class="delete-btn">
              <i class="delete"></i>
          </button>
      </div>
      
    `;
    if (inputNumber) {
      const deadline = element.querySelector('.deadline');
      deadline.innerHTML = `
      <article class="deadline-container">
        <div class="deadline-format">
            <span class="days">34</span>
        </div>
        <div class="deadline-format">
            <span class="hours">34</span>
        </div>
        <div class="deadline-format">
          <span class="minutes">34</span>
      </div>
      <div class="deadline-format">
          <span class="seconds">34</span>
      </div>
      </article>
      `;
      const setDeadline = element.querySelector('.deadline-container');
      let attr = document.createAttribute('data-id');
      attr.value = numbers;
      setDeadline.setAttributeNode(attr);
      const deadlineFormat = element.querySelectorAll('.deadline-format span');
      countdown(
        deadlineFormat,
        numbers.substring(0, 2),
        numbers.substring(2, 4),
        numbers.substring(4, 6),
        numbers.substring(6, 8),
      );
    }
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);
    list.appendChild(element);
    movement(element);
    addLocalStorage(id, value, numbers);
    resetToDefault();
    clearBtn.style.display = 'block';
  } else if (value !== '' && editSwitch) {
    editElement.textContent = value;

    editLocalStorage(editID, value);
    resetToDefault();
  }
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  element.classList.add('translateX-plus');
  setTimeout(() => {
    element.remove();
    if (list.children.length === 0) {
      clearBtn.style.display = 'none';
    }
  }, 1000);

  resetToDefault();
  removeLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  todoInput.value = editElement.textContent;
  editSwitch = true;
  editID = element.dataset.id;
  submitBtn.innerHTML = `
    <button class="edit-btn">
      <i class="edit"></i>
    </button>
    `;
}

function resetToDefault() {
  todoInput.value = '';
  editSwitch = false;
  editID = '';
  submitBtn.innerHTML = "<img src='./img/plus.svg' alt=''>";
  inputNumber = false;
  numbers = '';
  letters = '';
  form.classList.remove('active','active-deadline')
}

function clearItems() {
  const items = document.querySelectorAll('.todo-item');
  if (items.length > 0) {
    list.classList.add('translateX-plus')
    setTimeout(()=>{
      items.forEach(item => {
        list.removeChild(item);
      });
      list.classList.remove('translateX-plus')
    },1000)
  }
  resetToDefault();
  localStorage.removeItem('list');
  clearBtn.style.display = 'none';
}

// ------------ localStorage 및 새로고침시 localStorage로 다시 반환

function addLocalStorage(id, value, numbers) {
  const todo = { id, value, numbers };
  let items = getLocalStorage();
  items.push(todo);
  localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function removeLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(item => {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(item => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function loadItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value, item.numbers);
      clearBtn.style.display = 'block';
    });
  }
}

function createListItem(id, value, numbers) {
  const element = document.createElement('li');
  let attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add('todo-item');
  element.innerHTML = `
    <div class="deadline"></div>  
    <p class="title">${value}</p>
    <div class="btn-container">
        <button class="edit-btn">
        </button>
        <button class="delete-btn">
            <i class="delete"></i>
        </button>
    </div>
    `;
    if (numbers) {
      const deadline = element.querySelector('.deadline');
      deadline.innerHTML = `
      <article class="deadline-container">
        <div class="deadline-format">
            <span class="days">34</span>
        </div>
        <div class="deadline-format">
            <span class="hours">34</span>
        </div>
        <div class="deadline-format">
          <span class="minutes">34</span>
      </div>
      <div class="deadline-format">
          <span class="seconds">34</span>
      </div>
      </article>
      `;
      const setDeadline = element.querySelector('.deadline-container');
      let attr = document.createAttribute('data-id');
      attr.value = numbers;
      setDeadline.setAttributeNode(attr);
      const deadlineFormat = element.querySelectorAll('.deadline-format span');
      countdown(
        deadlineFormat,
        numbers.substring(0, 2),
        numbers.substring(2, 4),
        numbers.substring(4, 6),
        numbers.substring(6, 8),
      );
    }
  const deleteBtn = element.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', deleteItem);
  const editBtn = element.querySelector('.edit-btn');
  editBtn.addEventListener('click', editItem);
  list.appendChild(element);
}

// ------------ 디데이 기능 사용 시 데이터 가공 및 시간계산

function extract(value) {
  for (const item of value) {
    if (isNaN(item)) {
      letters += item;
    } else {
      numbers += item;
    }
  }
}

function countdown(deadlineFormat, month, day, hour, min) {
  const today = new Date();
  const future = new Date(today.getFullYear(), month - 1, day, hour, min, 0);
  const t = future.getTime() - today.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;
  const days = Math.floor(t / oneDay);
  const hours = Math.floor((t % oneDay) / oneHour);
  const minutes = Math.floor((t % oneHour) / oneMinute);
  const seconds = Math.floor((t % oneMinute) / 1000);
  const value = [days, hours, minutes, seconds];
  deadlineFormat.forEach((item, index) => {
    if (value[index] < 10) {
      item.textContent = `0${value[index]}`;
    } else {
      item.textContent = value[index];
    }
  });
}

setInterval(() => {
  if (list.children.length > 0) {
    const giftInfo = document.querySelectorAll('.deadline-container');
    giftInfo.forEach(e => {
      const id = e.dataset.id;
      const deadlineFormat = e.querySelectorAll('.deadline-format span');
      countdown(deadlineFormat, id.substring(0, 2), id.substring(2, 4), id.substring(4, 6), id.substring(6, 8));
    });
  }
}, 1000);

// ---------- textarea 텍스트양에 따른 동적높이 변경, 클래스 추가 및 제거

const initialHeight = parseInt(getComputedStyle(todoInput).getPropertyValue('height'));
todoInput.addEventListener('input', (e) => {
  console.log(e.target.value);
  if (e.target.value === '') {
    todoInput.style.height = '0px'
  } else if (/^\d{8}[^\d]+$/.test(e.target.value)){
    form.classList.add('active-deadline')
  }
  else {
    todoInput.style.height = `${initialHeight}px`;
    const newHeight = todoInput.scrollHeight - initialHeight; 
    todoInput.style.height = `${newHeight}px`
  }
});

function selected (e){
  if(e.target.id === 'todo-inpt'){
    form.classList.add('active')
  } else {
    form.classList.remove('active')
  }
}

function movement(e) {
  e.classList.add('translateXX-minus');
  setTimeout(() => {
    e.classList.add('translateX-minus');
  }, 100);
}

// ------------------------- 날씨 위젯

const name = prompt('what your name~!?');
const cityValue = prompt('Where are you now?(영어로 대답해주세요)')

const weather = document.querySelector('.weather-widget')
document.querySelector('.username').textContent = `Welcome ${name}😊`;

let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=c036856d4420294449cdc97f8ba1e616&units=metric`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        weather.innerHTML = `
        <h2><img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"> ${data.name}</h2>
        <h2>${data.weather[0].main}</h2>
        <h3>${data.main.temp} &#176;</h3>
      `;
      })

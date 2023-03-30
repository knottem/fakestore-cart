"use strict";
import { fetchData } from "./fetch.js";

let shop;
let totalCost = [];

if(localStorage.getItem('shop') != null) {
  shop = JSON.parse(localStorage.getItem('shop'));
  fetchData(renderInDropdown, shop);
  document.getElementById('navbarDropdownMenuLink').innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
} else {
  shop = []
  document.getElementById('navbarDropdownMenuLink').innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
}

//fetch data from API
fetchData(renderProductCard);

//render items in dropdown
function addToCart(id) {
  if (shop.some(item => item[0] === id)) {
    shop.find(item => item[0] === id)[1] += 1;
  }
  else {
    shop.push([id, 1])
  }
  localStorage.setItem('shop', JSON.stringify(shop));
  document.getElementById('cartItems').innerHTML = '';
  fetchData(renderInDropdown, shop);
  document.getElementById('navbarDropdownMenuLink').innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
}

function renderInDropdown(element, quantity) {
  let list = document.createElement('li');
  list.classList.add('list-group-item', 'd-flex', 'flex-column', 'align-items-center', 'mb-2', 'border', 'border-2', 'border-dark', 'rounded-3');
  list.innerHTML = `
      <div class="w-100 mb-2" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <p class="m-0">${element.title}</p>
      </div>
      <div class="w-100 d-flex justify-content-between align-items-center">
        <img src="${element.image}" alt="${element.title}" class="img-fluid" style="width: 50px; height: 50px;">
        <div class="input-group input-group-sm" style="width: 140px;">
          <button class="btn btn-outline-secondary" type="button" id="btnPlus">+</button>
          <input type="text" class="form-control" value="${quantity}" aria-describedby="button-addon1" >
          <button class="btn btn-outline-secondary" type="button" id="btnMinus">-</button>
        </div>
        <span class="text-secondary font-weight-bold " id="price">$${element.price * quantity}</span>
        <button class="btn btn-outline-danger btn-sm" id="btnDelete">Delete</button>
      </div>
      `;
  document.getElementById('cartItems').appendChild(list);

  let titleDiv = list.querySelector('.w-100');
  titleDiv.style.overflow = 'hidden';
  titleDiv.style.textOverflow = 'ellipsis';
  titleDiv.style.whiteSpace = 'nowrap';

  let input = list.querySelector('.input-group input');
  let minusButton = list.querySelector('#btnMinus');
  let plusButton = list.querySelector('#btnPlus');
  let deleteButton = list.querySelector('#btnDelete');
  let navbarDropdownMenuLink = document.getElementById('navbarDropdownMenuLink');
  
  if(totalCost.some(item => item[0] === element.id)) {
    totalCost.find(item => item[0] === element.id)[1] += element.price;
    document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);
  } else {
    totalCost.push([element.id, element.price * quantity]);
    document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);
  }

  minusButton.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      input.value = quantity;
      list.querySelector('#price').innerHTML = (element.price * quantity).toFixed(2);
      shop.find(item => item[0] === element.id)[1] = quantity;
      navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;

      totalCost.find(item => item[0] === element.id)[1] = element.price * quantity;
      document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

      localStorage.setItem('shop', JSON.stringify(shop));
    } else {
      shop = shop.filter(item => item[0] !== element.id);
      navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
      localStorage.setItem('shop', JSON.stringify(shop));
      
      totalCost.splice(totalCost.findIndex(item => item[0] === element.id), 1);
      document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

      list.remove();
    }
  });

  input.addEventListener('change', () => {
    if (input.value > 0) {
      quantity = input.value;
      list.querySelector('#price').innerHTML = (element.price * quantity).toFixed(2);
      shop.find(item => item[0] === element.id)[1] = quantity;
      navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
      
      totalCost.find(item => item[0] === element.id)[1] = element.price * quantity;
      document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

      localStorage.setItem('shop', JSON.stringify(shop));
    } else {
      shop = shop.filter(item => item[0] !== element.id);
      navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
      localStorage.setItem('shop', JSON.stringify(shop));
      
      totalCost.splice(totalCost.findIndex(item => item[0] === element.id), 1);
      document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

      list.remove();
    }
  });

  plusButton.addEventListener('click', () => {
    quantity++;
    input.value = quantity;
    list.querySelector('#price').innerHTML = element.price * quantity;
    shop.find(item => item[0] === element.id)[1] = quantity;
    navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
    
    totalCost.find(item => item[0] === element.id)[1] = element.price * quantity;
    document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

    localStorage.setItem('shop', JSON.stringify(shop));
  });

  deleteButton.addEventListener('click', () => {
    shop = shop.filter(item => item[0] !== element.id);
    localStorage.setItem('shop', JSON.stringify(shop));
    
    totalCost.splice(totalCost.findIndex(item => item[0] === element.id), 1);
    document.getElementById('cost').innerText = totalCost.reduce((acc, item) => acc + item[1], 0).toFixed(2);

    navbarDropdownMenuLink.innerText = `Cart (${shop.reduce((acc, item) => acc + item[1], 0)})`;
    list.remove();
  });
}

function renderProductCard(element) {
  const card = document.createElement('div');
  card.classList.add('col-sm-11', 'col-md-6', 'col-lg-3', 'col-xl-3', 'col-xxl-2', 'mb-4', 'card-container');
  card.innerHTML = `
          <div class="card card-hover" style="border-radius: 15px;">
            <div class="text-center" style="height: 200px">
              <img src="${element.image}" style="border-top-left-radius: 15px; border-top-right-radius: 15px; max-height: 200px;" class="img-fluid" alt="${element.title}"/>
            </div>
            <div class="card-body pb-0">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="title">${element.title}</p>
                  <p class="small text-muted">${element.category}</p>
                </div>
                <div>
                <div class="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
              </div>
                </div>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body pb-0">
              <div class="d-flex justify-content-between">
                <p>$${element.price}</p>
                <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body pb-0">
            <div class="description-container">
              <p class="text-dark line-clamp">${element.description}</p>
            </div>
          </div>
          <hr class="my-0" />
            <div class="card-body">
              <div class="d-flex justify-content-center align-items-center pb-2 mb-1">
                <button class="btn btn-primary">Buy now</button>
              </div>
            </div>
          </div>
    `;
  document.querySelector('.row').appendChild(card);

  card.querySelector('.btn').addEventListener('click', () => {
    addToCart(element.id);
  });

  const descriptionContainerElement = card.querySelector('.description-container');


  //adds the class 'has-more-text' to the description container if the description is longer than the container and shows a gradient at the bottom when it's not expanded
  if (descriptionContainerElement.scrollHeight > descriptionContainerElement.clientHeight) {
    descriptionContainerElement.classList.add('has-more-text');
  }

  //made the description expand on hover and collapse on mouseleave of the entire card
  descriptionContainerElement.addEventListener('mouseenter', () => {
    descriptionContainerElement.classList.add('expanded');
  });

  card.addEventListener('mouseleave', () => {
    descriptionContainerElement.classList.remove('expanded');
  });
}
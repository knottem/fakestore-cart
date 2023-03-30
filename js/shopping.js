"use strict";
import { fetchData } from "./fetch.js";

let shop = []

//fetch data from API
fetchData(renderProductCard);

//add to checkout function
function addToCheckout(id, quantity) {
  let item = [id, quantity]
  shop.push(item);
  localStorage.setItem('shop', JSON.stringify(shop));
  location.href = "checkout.html";
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
    addToCheckout(element.id, 1);
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
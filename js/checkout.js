"use strict";
let shop = JSON.parse(localStorage.getItem('shop'));
const priceLocation = document.getElementById('totalprice');

import { fetchData } from "./fetch.js";

let totalPrice = 0;

if (shop != null) {
    fetchData(renderCheckoutCard, shop);
} else {
    priceLocation.innerText = `Your cart is empty`;
}

const total = {
    name: false,
    email: false,
    phone: false,
    address: false,
    zip: false,
    city: false
};

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const addressError = document.getElementById("addressError");
const zipError = document.getElementById("zipError");
const cityError = document.getElementById("cityError");

const names = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const zip = document.getElementById("zip");
const city = document.getElementById("city");

const phonePattern = /^[0-9()-]+$/;
const zipPattern = /^(?=(\D*\d){5}\D*$)(?=[^ ]* ?[^ ]*$)[\d ]*$/;

const sendButton = document.getElementById("sendButton");

function validateName() {
    if (names.value.length < 2 || names.value.length > 50) {
        nameError.innerHTML = "Name must be filled out and at least 2 characters long and not more than 50 characters";
        total.name = false;
        sendButton.disabled = true;
        return false;
    } else {
        nameError.innerHTML = "&nbsp;";
        total.name = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

function validateEmail() {
    if (!email.value.includes("@") || email.value.length > 50) {
        emailError.innerHTML = "Email must be filled out and contain @ and not more than 50 characters";
        total.email = false;
        sendButton.disabled = true;
        return false;
    } else {
        emailError.innerHTML = "&nbsp;";
        total.email = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

function validatePhone() {
    if (!phonePattern.test(phone.value) || phone.value.length > 50) {
        phoneError.innerHTML = "Phone must be filled out and contain only numbers, () and - and not more than 50 characters";
        total.phone = false;
        sendButton.disabled = true;
        return false;
    } else {
        phoneError.innerHTML = "&nbsp;";
        total.phone = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

function validateAdress() {
    if (address.value.length < 4 || address.value.length > 50) {
        addressError.innerHTML = "Address must be atleast 4 and not more than 50 characters";
        total.address = false;
        sendButton.disabled = true;
        return false;
    } else {
        addressError.innerHTML = "&nbsp;";
        total.address = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

function validateZip() {
    if (!zipPattern.test(zip.value) || zip.value.length > 6) {
        zipError.innerHTML = "Zip must contain only numbers in the format of (000 00) and not more than 6 characters";
        total.zip = false;
        sendButton.disabled = true;
        return false;
    } else {
        zipError.innerHTML = "&nbsp;";
        total.zip = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

function validateCity() {
    if (city.value.length < 2 || city.value.length > 50) {
        cityError.innerHTML = "City must be atleast 2 and not more than 50 characters";
        total.city = false;
        sendButton.disabled = true;
        return false;
    } else {
        cityError.innerHTML = "&nbsp;";
        total.city = true;
        if (Object.values(total).every((val) => val === true)) {
            sendButton.disabled = false;
        }
        return true;
    }
}

names.addEventListener("blur", validateName);
email.addEventListener("blur", validateEmail);
phone.addEventListener("blur", validatePhone);
address.addEventListener("blur", validateAdress);
zip.addEventListener("blur", validateZip);
city.addEventListener("blur", validateCity);

sendButton.addEventListener("click", validateForm);

document.getElementById("buttonlocation").addEventListener("mouseover", function () {
    if (!validateName() || !validateEmail() || !validatePhone() || !validateAdress() || !validateZip() || !validateCity()) {
        if (buttonLocation.disabled == false) {
            buttonLocation.disabled = true;
        }
    }
});

function validateForm() {
    if (!validateName() || !validateEmail() || !validatePhone() || !validateAdress() || !validateZip() || !validateCity() || shop == null) {
        sendButton.disabled = true;
        if (shop == null) {
            alert("Your cart is empty");
        }
    } else {
        sessionStorage.setItem('customer', JSON.stringify({
            'name': names.value,
            'email': email.value,
            'phone': phone.value,
            'address': address.value,
            'zip': zip.value,
            'city': city.value
        }));
        location.href = "confirmation.html";
    }
}

function renderCheckoutCard(element, quantity) {
    const checkoutCard = document.createElement('div');
    checkoutCard.classList.add('col-sm-11', 'col-md-11', 'col-lg-7', 'mb-4');
    checkoutCard.innerHTML = `
    <div class="card" style="border-radius: 15px;">
        <div class="row g-0">
            <div class="col-md-2">
                <img src="${element.image}" style="border-top-left-radius: 15px; border-bottom-left-radius: 15px; max-height: 150px; object-fit: cover;" class="img-fluid" alt="${element.title}" />
            </div>
            <div class="col-md-10">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="title">${element.title}</p>
                            <p class="small text-muted">${element.category}</p>
                        </div>
                        <div>
                            <p>$${element.price}</p>
                            <p>Quantity: ${quantity}</p>
                            <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
    document.querySelector('.checkout').appendChild(checkoutCard);

    totalPrice += element.price * quantity;
    console.log(totalPrice);
    priceLocation.innerText = `Total Sum: $${totalPrice.toFixed(2)}`;
}
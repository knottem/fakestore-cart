import { products } from "./products.js";

export function fetchData(functionName, shop = null, text = null) {
  const timeout = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => { controller.abort(); }, timeout);


  const url = 'https://server.knotten.net/fakestore/';
  const url1 = 'https://fakestoreapi.com/products/';

  if (shop == null) {
    let url2 = url;
    let url3 = url1;
    if (text != null) {
      url2 = url + text;
      url3 = url1 + text;
    }
    fetch(url2, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        //console.log("fetch success from primary API");
        data.forEach(functionName);
        clearTimeout(timeoutId);
      })
      .catch(error => {
        //console.log(`Failed to fetch from primary API: ${error}`);
        fetch(url3, { signal: controller.signal })
          .then(res => res.json())
          .then(data => {
            //console.log("fetch success from backup API");
            data.forEach(functionName);
            clearTimeout(timeoutId);
          })
          .catch(error => {
            //console.log(`Failed to fetch from backup API: ${error}`);
            if (text != null) {
              products.filter(product => product.category == text).forEach(functionName);
            } else {
              products.forEach(functionName);
            }
            clearTimeout(timeoutId);
          });
      });
  } else {
    shop.forEach((element) => {
      let url2 = url + element[0];
      let url3 = url1 + element[0];
      fetch(url2, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          //console.log("fetch success from primary API");
          functionName(data, element[1]);
          clearTimeout(timeoutId);
        })
        .catch(error => {
          //console.log(`Failed to fetch from primary API: ${error}`);
          fetch(url3, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
              //console.log("fetch success from backup API");
              functionName(data, element[1]);
              clearTimeout(timeoutId);
            })
            .catch(error => {
              //console.log(`Failed to fetch from backup API: ${error}`);
              functionName(products[element[0] - 1], element[1]);
              clearTimeout(timeoutId);
            });
        });
    });
  }
}
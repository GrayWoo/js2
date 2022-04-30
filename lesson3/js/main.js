const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
// переписать на промис (!!!!!!!не fetch !!!!!!!!!!)
// Далее НЕ ИСПОЛЬЗОВАТЬ В КОДЕ!
let getRequest = (url, cb) => {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        console.log("Error");
      } else {
        cb(xhr.responseText);
      }
    }
  };
  xhr.send();
};
// ---------------------------------

class ProductList {
  constructor(container = ".products") {
    this.container = document.querySelector(container);
    this.goods = [];
    this.productObjects = [];

    this.fetchGoods();
    this.render();

    this.getProducts().then((data) => {
      this.goods = data;
      this.render();
    });
  }

  fetchGoods() {
    getRequest(`${API}/catalogData.json`, (data) => {
      console.log(data);
      this.goods = JSON.parse(data);
      this.render();
    });
  }

  getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  render() {
    for (const good of this.goods) {
      const productObject = new ProductItem(good);
      console.log(productObject);
      this.productObjects.push(productObject);

      this.container.insertAdjacentHTML("beforeend", productObject.getHTMLString());
    }
  }
}

// Ключи в объектах не совпадали с json ответом, пофиксил
class ProductItem {
  constructor(product, img = "https://via.placeholder.com/200x150") {
    this.id = product.id_product;
    this.title = product.product_name;
    this.price = product.price;
    this.img = img;
  }

  getHTMLString() {
    return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} \u20bd</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`;
  }
}

new ProductList();

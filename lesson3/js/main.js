const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
// переписать на промис (!!!!!!!не fetch !!!!!!!!!!)
// Далее НЕ ИСПОЛЬЗОВАТЬ В КОДЕ!
// let getRequest = (url, cb) => {
//   let xhr = new XMLHttpRequest();
//   xhr.open("GET", url, true);
//   xhr.onreadystatechange = () => {
//     if (xhr.readyState === 4) {
//       if (xhr.status !== 200) {
//         console.log("Error");
//       } else {
//         cb(xhr.responseText);
//       }
//     }
//   };
//   xhr.send();
// };

const getRequest = (url) =>
  new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = function () {
      reject(Error("error fetching JSON data"));
    };
    xhr.send();
  });

// ---------------------------------

class ProductList {
  constructor(container = ".products") {
    this.container = document.querySelector(container);
    this.goods = [];
    this.productObjects = [];

    this.fetchGoods();
  }

  fetchGoods() {
    getRequest(`${API}/catalogData.json`).then((data) => {
      this.goods = JSON.parse(data);
      this.render();
      new Cart(this.goods);
    });
  }

  render() {
    for (const good of this.goods) {
      const productObject = new ProductItem(good);
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
                    <button class="buy-btn" id="product-btn${this.id}">Купить</button>
                </div>
            </div>`;
  }
}

class Cart {
  constructor(goods) {
    this.cart = document.querySelector(".cart__list");
    this.goods = goods;
    this.cartProducts = [];

    this.getBasket();
    this.addEvents();
  }

  async getBasket() {
    const request = await fetch(`${API}/getBasket.json`);
    if (!request.ok) return;

    const response = await request.json();
    this.cartProducts = response.contents;
    for (let i = 0; i < this.cartProducts.length; i++) {
      this.createProductElment(this.cartProducts[i]);
    }
  }

  checkInCart(id) {
    return this.cartProducts.findIndex((el) => el.id_product === id);
  }

  async addToCart(id) {
    const request = await fetch(`${API}/addToBasket.json`);
    if (!request.ok) {
      return;
    }

    const response = await request.json();
    console.log(
      "Не совсем понятно как это должно работать если на стороне бэка стоит Мок! А на метод пост выдаёт 403. Методичка к ДЗ не очевидна! Результат запроса на добавление:",
      response.result
    );

    const index = this.checkInCart(id);
    if (index !== -1) this.cartProducts[index].quantity++;
    this.rerender();
  }

  async deleteFromCart(id) {
    const request = await fetch(`${API}/deleteFromBasket.json`);
    if (!request.ok) {
      return;
    }

    const response = await request.json();
    console.log(
      "Не совсем понятно как это должно работать если на стороне бэка стоит Мок! А на метод пост выдаёт 403. Методичка к ДЗ не очевидна! Результат запроса на удаление:",
      response.result
    );

    const index = this.checkInCart(id);
    if (index !== -1) this.cartProducts[index].quantity--;
    this.rerender();
  }

  createProductElment(product) {
    const deleteEl = (e) => this.deleteFromCart(product.id_product);

    const li = document.createElement("li");
    li.innerText = `${product.id_product} ${product.product_name} ${product.price} кол-во: ${product.quantity}`;

    const button = document.createElement("button");
    button.innerHTML = "&#9587";
    button.onclick = deleteEl;

    li.appendChild(button);

    this.cart.appendChild(li);
  }

  rerender() {
    const old = document.querySelector("ol");
    old.innerHTML = "";
    for (let i = 0; i < this.cartProducts.length; i++) {
      if (this.cartProducts[i].quantity > 0) this.createProductElment(this.cartProducts[i]);
    }
  }

  addEvents() {
    const itemBtns = document.querySelectorAll(".buy-btn");

    itemBtns.forEach((el) => {
      el.addEventListener("click", (e) => {
        const id = +e.currentTarget.id.replace(/[^0-9]/g, "");
        this.addToCart(id);
      });
    });

    const cartContainer = document.querySelector(".cart");

    document
      .querySelector(".btn-cart")
      .addEventListener("click", () => cartContainer.classList.toggle("hidden"));
  }
}

new ProductList();

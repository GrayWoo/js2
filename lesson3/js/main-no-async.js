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

    this.addEvents();
  }

  checkInCart(id) {
    return this.cartProducts.find((el) => el.id_product === id);
  }

  addToCart(id) {
    const product = this.goods.find((el) => el.id_product === id);
    this.cartProducts.push(product);

    this.createProductElment(product);
  }

  deleteFromCart(id) {
    const index = this.cartProducts.findIndex((el) => el.id_product === id);
    if (index !== -1) this.cartProducts.splice(index, 1);
  }

  getProductsInCart() {
    return this.cartProducts;
  }

  createProductElment(product) {
    const deleteEl = (e) => {
      e.currentTarget.parentNode.remove();
      this.deleteFromCart(product.id_product);
    };

    const li = document.createElement("li");
    li.innerText = `${product.id_product} ${product.product_name} ${product.price}`;

    const button = document.createElement("button");
    button.innerHTML = "&#9587";
    button.onclick = deleteEl;

    li.appendChild(button);

    this.cart.appendChild(li);
  }

  addEvents() {
    const itemBtns = document.querySelectorAll(".buy-btn");

    itemBtns.forEach((el) => {
      el.addEventListener("click", (e) => {
        const id = +e.currentTarget.id.replace(/[^0-9]/g, "");
        const include = this.checkInCart(id);

        if (include) return;

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

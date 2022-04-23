class ProductList {
  constructor(container = ".products") {
    this.container = document.querySelector(container);
    this.goods = [];
    this.productObjects = [];

    this.sum = 0;

    this.fetchGoods();
    this.getSum();
    this.render();
  }

  fetchGoods() {
    this.goods = [
      { id: 1, title: "Notebook", price: 20000 },
      { id: 2, title: "Mouse", price: 1500 },
      { id: 3, title: "Keyboard", price: 5000 },
      { id: 4, title: "Gamepad", price: 4500 },
    ];
  }

  // Добавьте для GoodsList метод, определяющий суммарную стоимость всех товаров.
  getSum() {
    if (this.goods?.length) this.goods.forEach((el) => (this.sum += el.price));
    console.log(this.sum);
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

class ProductItem {
  constructor(product, img = "https://via.placeholder.com/200x150") {
    this.id = product.id;
    this.title = product.title;
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

/*Добавьте пустые классы для Корзины товаров и Элемент корзины товаров. Продумайте,
какие методы понадобятся для работы с этими сущностями. */
class Cart {
  constructor(cart = ".cart") {
    this.cart = document.querySelector(cart);
    this.products = [];
    this.buy();
    this.addToCart();
    this.deleteFromCart();
    this.openCart();
    this.closeCart();
    this.render();
  }
}

/*Добавьте пустые классы для Корзины товаров и Элемент корзины товаров. Продумайте,
какие методы понадобятся для работы с этими сущностями. */
class CartProduct extends ProductItem {
  constructor(id, title, price, img) {
    super(id, title, price, img);
  }
}

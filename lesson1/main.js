const products = [
  { id: 1, title: "Notebook", price: 1000 },
  { id: 2, title: "Mouse", price: 100 },
  { id: 3, title: "Keyboard", price: 250 },
  { id: 4, title: "Gamepad", price: 150 },
];

// Функция с дефолтными параметрами
const getProductHTMLString = (title = null, price = null) =>
  `<div class="product-item">
      <h3>${title}</h3>
      <p>${price}</p>
      <button class="by-btn">Добавить</button>
    </div>`;

const el = document.querySelector(".products");

// Вставка в html
products.forEach((prod) =>
  el.insertAdjacentHTML("beforeend", getProductHTMLString(prod.title, prod.price))
);

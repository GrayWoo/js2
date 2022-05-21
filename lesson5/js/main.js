const app = new Vue({
  el: "#app",
  data: {
    goods: [],
    filteredGoods: [],
    basketGoods: [],
    searchLine: "",
    isVisibleCart: true,
    baseURL:
      "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/",
  },
  methods: {
    async makeGETRequest(url) {
      const request = await fetch(this.baseURL + url);
      if (!request.ok) return request.statusText;

      return await request.json();
    },

    addToBasket(id) {
      const toBasket = this.goods.find((el) => el.id_product === +id);
      const i = this.basketGoods.findIndex((el) => el.id_product === +id);

      if (i > -1) {
        const newEl = this.basketGoods[i];
        newEl.quantity++;
        app.$set(app.basketGoods, i, newEl);
      } else {
        toBasket.quantity = 1;
        this.basketGoods.push(toBasket);
      }
    },

    deleteFromBasket(id) {
      const i = this.basketGoods.findIndex((el) => el.id_product === +id);

      if (this.basketGoods[i].quantity - 1 > 0) {
        const newEl = this.basketGoods[i];
        newEl.quantity--;
        app.$set(app.basketGoods, i, newEl);
      } else {
        this.basketGoods.splice(i, 1);
      }
    },

    viewCart() {
      this.isVisibleCart = !this.isVisibleCart;
    },

    filterGoods() {
      let regexp = new RegExp(this.searchLine, "i");
      this.filteredGoods = this.goods.filter((good) => regexp.test(good.product_name));
    },
  },

  async created() {
    this.goods = await this.makeGETRequest("catalogData.json");
    const arrBasket = await this.makeGETRequest("getBasket.json");
    this.basketGoods = arrBasket?.contents;
    this.filteredGoods = this.goods;
  },
});

function addBasket(event) {
  app.addToBasket(event.target.id);
}
function deleteItem(event) {
  app.deleteFromBasket(event.target.id);
}

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
      if (!request.ok) {
        this.$refs.error.setError("Ошибка: " + request.status);
        return;
      }

      return await request.json();
    },
  },
});

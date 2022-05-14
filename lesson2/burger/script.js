class Hamburger {
  constructor() {
    this.size = document.querySelector('input[name="size"]:checked').value;
    this.type = document.querySelector("select").value;
    this.adds = [];
    this.mapPriceCal = new Map([
      ["small", { price: 50, cal: 20 }],
      ["big", { price: 100, cal: 40 }],
      ["cheese", { price: 10, cal: 20 }],
      ["salad", { price: 20, cal: 5 }],
      ["potato", { price: 15, cal: 10 }],
      ["spice", { price: 15, cal: 0 }],
      ["mayonnaise", { price: 20, cal: 5 }],
    ]);
    this.cal = 0;
    this.price = 0;
    this.setEvents();
    this.calculate();
  }

  calculate() {
    const arr = [this.size, this.type, ...this.adds];

    let priceCalc = 0;
    let calCal = 0;

    for (let i = 0; i < arr.length; i++) {
      let el = this.mapPriceCal.get(arr[i]);
      priceCalc += el.price;
      calCal += el.cal;
    }

    this.price = priceCalc;
    this.cal = calCal;

    document.querySelector("#res").innerHTML = `Цена: ${this.price},  Калорийность: ${this.cal}`;
  }

  setEvents() {
    document.querySelectorAll('input[name="size"]').forEach((el) =>
      el.addEventListener("click", (e) => {
        this.size = e.currentTarget.value;
        this.calculate();
      })
    );

    document.querySelector("select").addEventListener("change", (e) => {
      this.type = e.currentTarget.value;
      this.calculate();
    });

    document.querySelectorAll('input[name="adds"]').forEach((el) =>
      el.addEventListener("click", (e) => {
        const input = e.currentTarget;
        if (input.checked) {
          this.adds.push(input.value);
        } else {
          const index = this.adds.indexOf(input);
          this.adds.splice(index, 1);
        }
        this.calculate();
      })
    );
  }
}

new Hamburger();

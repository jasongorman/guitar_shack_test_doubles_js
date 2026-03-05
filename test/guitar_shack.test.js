const assert = require("assert");

class Product {
    id;
    stock;
    constructor(id, stock) {
        this.id = id;
        this.stock = stock;
    }

}

class StockMonitor {
    alert;
    warehouse;
    restockLevel;
    constructor(warehouse, restockLevel, alert) {
        this.warehouse = warehouse;
        this.restockLevel = restockLevel;
        this.alert = alert;
    }

    handleSale(productId, quantity) {
        const product = this.warehouse.getProduct(productId);
        const remainingStock = product.stock - quantity;
        if(remainingStock <= this.restockLevel.calculate(productId)) {
            this.alert.send(`Please order more of product ${productId}`);
        }
    }
}

describe("Guitar Shack", () => {
    it("sends an alert when stock reaches restock level", () => {
        const alert = {send: function (message) {
                this.message = message;
            }
        };

        const product = new Product(811, 25);

        const warehouse = {getProduct: () => product};

        const restockLevel = {calculate: () => 24};

        const stockMonitor = new StockMonitor(warehouse, restockLevel, alert);

        stockMonitor.handleSale(811, 1);

        assert.strictEqual(alert.message, "Please order more of product 811");
    });

    it("send no alert when stock stays above restock level", () => {
        const alert = {send: function (message) {
                this.message = message;
            }
        };

        const product = new Product(811, 26);

        const warehouse = {getProduct: () => product};

        const restockLevel = {calculate: () => 24};

        const stockMonitor = new StockMonitor(warehouse, restockLevel, alert);

        stockMonitor.handleSale(811, 1);

        assert.strictEqual(alert.message, undefined);
    });
})
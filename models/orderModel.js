export default class OrderModel{
    constructor(orderId,orderDate,cusCode,orderDetail,discount) {
        this._orderId = orderId;
        this._orderDate = orderDate;
        this._cusCode = cusCode;
        this._orderDetail = orderDetail;
        this._discount = discount;
    }

    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get orderDate() {
        return this._orderDate;
    }

    set orderDate(value) {
        this._orderDate = value;
    }

    get cusCode() {
        return this._cusCode;
    }

    set cusCode(value) {
        this._cusCode = value;
    }

    get orderDetail() {
        return this._orderDetail;
    }

    set orderDetail(value) {
        this._orderDetail = value;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value;
    }
}
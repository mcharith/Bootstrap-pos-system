export default class OrderDetailsModel{
    constructor(oid,itemCode,price,qty) {
        this._orderId = oid;
        this._itemCode = itemCode;
        this._price = price;
        this._qty = qty;
        this._oid = oid;
    }

    get oid() {
        return this._oid;
    }

    set oid(value) {
        this._oid = value;
    }

    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }
}
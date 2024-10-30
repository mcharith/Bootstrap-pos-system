export default class ItemModel {
    constructor(itemCode, itemName, itemPrice, itemQty) {
        this._itemCode = itemCode;
        this._itemName = itemName;
        this._itemPrice = itemPrice;
        this._itemQty = itemQty;
    }

    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get itemName() {
        return this._itemName;
    }

    set itemName(value) {
        this._itemName = value;
    }

    get itemPrice() {
        return this._itemPrice;
    }

    set itemPrice(value) {
        this._itemPrice = value;
    }

    get itemQty() {
        return this._itemQty;
    }

    set itemQty(value) {
        this._itemQty = value;
    }
}
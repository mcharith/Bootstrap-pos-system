export default class CustomerModel{
    constructor(code,name,address,age,contact) {
        this._code = code;
        this._name = name;
        this._address = address;
        this._age = age;
        this._contact = contact;
    }
    get code() {
        return this._code;
    }

    set code(value) {
        this._code = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }

    get contact() {
        return this._contact;
    }

    set contact(value) {
        this._contact = value;
    }
}
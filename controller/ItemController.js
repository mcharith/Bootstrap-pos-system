import ItemModel from "../models/itemModel.js";
import {customer_array, item_array, order_array} from "../db/database.js";
import {loadItemCode} from "./OrderFormController.js";
let selected_item_index = null;
const cleanItemForm = () => {
    $("#itemCode").val("");
    $("#itemName").val("");
    $("#price").val("");
    $("#qty").val("");
}

$("#item-save-btn").on('click', function () {
    let itCode = $("#itemCode").val();
    let itName = $("#itemName").val();
    let price = $("#price").val();
    let qty = $("#qty").val();

    let res = saveItem(itCode, itName, price, qty);
    if (res) {
        cleanItemForm();
        loadItemTable()
    }
});
$("#item-update-btn").on('click',function (){
    let itCode = $("#itemCode").val();
    let itName = $("#itemName").val();
    let price = $("#price").val();
    let qty = $("#qty").val();

    let option = confirm(`Do you want to update: ${itCode}`);
    if (option) {
        let res = updateItem(itCode,itName,price,qty);
        if (res) {
            Swal.fire("Item Updated successfully!");
            loadItemTable();
            cleanItemForm();
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    }
});

$("#item-delete-btn").on('click',function (){
    let itCode = $("#itemCode").val();

    let option = confirm(`Do you want to delete: ${itCode}`);
    if (option){
        let res = deleteItem(itCode);
        if (res){
            Swal.fire("Customer delete successfully!");
        }else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    }
    loadItemTable();
    cleanItemForm();
});

$("#item-search-btn").on('click', function () {
    let searchTerm = $(".input-group .form-control").val().trim();
    let searchBy = $(".input-group .form-select").val();

    console.log("Search Term:", searchTerm);
    console.log("Search By:", searchBy);

    let result;
    if (searchBy === "code") {
        result = searchItemByCode(searchTerm);
    } else if (searchBy === "name") {
        result = searchItemByName(searchTerm);
    }

    if (result) {
        Swal.fire({
            title: "Item Found",
            text: `ID: ${result.itemCode}, Name: ${result.itemName}, Price: ${result.itemPrice}, Qty: ${result.itemQty}`,
            icon: "success"
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Not Found",
            text: "No item matches the search criteria."
        });
    }
});
function searchItemByCode(code) {
    for (let i = 0; i < item_array.length; i++) {
        if (item_array[i].itemCode === code) {
            console.log("Item Found by Code:", item_array[i]);
            return item_array[i];
        }
    }
    console.log("No item found with code:", code);
    return null;
}
function searchItemByName(name) {
    for (let i = 0; i < item_array.length; i++) {
        if (item_array[i].itemName.toLowerCase() === name.toLowerCase()) {
            console.log("Item Found by Name:", item_array[i]);
            return item_array[i];
        }
    }
    console.log("No item found with name:", name);
    return null;
}
function deleteItem(code){
    let result = searchItem(code);
    if (result != null){
        let number = item_array.indexOf(result);
        item_array.splice(number,1);
        return true;
    }else {
        return false;
    }
}
function searchItem(code) {
    for (var i in item_array) {
        if (item_array[i].itemCode === code) return item_array[i];
    }
    return null;
}
function updateItem(itCode,itName,price,qty){
    let item = searchItem(itCode);
    if (item != null) {
        item.itemCode = itCode;
        item.itemName = itName;
        item.itemPrice = price;
        item.itemQty = qty;
        return true;
    }
    return false;
}
function saveItem(itCode, itName, price, qty) {
    let itemModel = new ItemModel(itCode, itName, price, qty);
    item_array.push(itemModel);
    loadItemCode();
    // console.log(itemModel);
    return true;
}
const loadItemTable = () => {
    $("#itemTableBody").empty();
    item_array.map((item, index) => {
        // console.log(item);
        let data = `<tr><td>${item.itemCode}</td><td>${item.itemName}</td><td>${item.itemPrice}</td><td>${item.itemQty}</td></tr>`
        $("#itemTableBody").append(data);
    })
}
$('#itemTableBody').on('click', 'tr', function () {
    let index = $(this).index();

    selected_item_index = $(this).index();

    let item_obj = item_array[index];

    let code = item_obj.itemCode;
    let name = item_obj.itemName;
    let price = item_obj.itemPrice;
    let qty = item_obj.itemQty;

    $('#itemCode').val(code);
    $('#itemName').val(name);
    $('#price').val(price);
    $('#qty').val(qty);
});

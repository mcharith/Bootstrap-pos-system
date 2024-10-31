import OrderDetailsModel from "../models/orderDetailsModel.js";
import OrderModel from "../models/orderModel.js";
import { CustomerModel } from "../models/customerModel.js";
import ItemModel from "../models/itemModel.js";
import { customer_array, item_array, order_array } from "../db/database.js";

generateOrderId();
generateDate();
function generateOrderId() {
    if (order_array.length === 0) {
        $('#txtOrderId').val("OR-001");
    } else {
        let lastOrderId = order_array[order_array.length - 1].orderId;
        let newIdNumber = Number.parseInt(lastOrderId.substring(3)) + 1;
        let newId = "OR-" + newIdNumber.toString().padStart(3, '0');
        $('#txtOrderId').val(newId);
    }
}
function generateDate() {
    let today = new Date();
    let formattedDate = today.toISOString().split('T')[0];
    $("#txtDate").val(formattedDate);
}
export function loadCustomerId() {
    $('#cmbCustomerId').empty().append("<option disabled selected>--Select--</option>");
    customer_array.forEach(customer => {
        $('#cmbCustomerId').append(`<option>${customer.cusId}</option>`);
    });

    $('#cmbCustomerId').on('change', function () {
        let selectedCustomerId = $(this).val();
        let customer = customer_array.find(c => c.cusId === selectedCustomerId);
        if (customer) {
            $('#txtCustomerId').val(customer.cusId);
            $('#txtCustomerName').val(customer.cusName);
            $('#txtCustomerAddress').val(customer.cusAddress);
            $('#txtCustomerContact').val(customer.cusContact);
            $('#txtCustomerAge').val(customer.cusAge);
        }
    });
}
export function loadItemCode() {
    $('#cmbItemCode').empty().append("<option disabled selected>--Select--</option>");
    item_array.forEach(item => {
        $('#cmbItemCode').append(`<option>${item.itemCode}</option>`);
    });

    $('#cmbItemCode').on('change', function () {
        let selectedItemCode = $(this).val();
        let item = item_array.find(i => i.itemCode === selectedItemCode);
        if (item) {
            $('#txtItemCode').val(item.itemCode);
            $('#txtDescription').val(item.itemName);
            $('#txtQtyOnHand').val(item.itemQty);
            $('#txtUnitPrice').val(item.itemPrice);
        }
    });
}
$('#btnAddToCart').click(function () {
    let itemCode = $('#txtItemCode').val();
    let description = $('#txtDescription').val();
    let orderQty = parseInt($('#txtOrderQTY').val());
    let unitPrice = parseFloat($('#txtUnitPrice').val());
    let total = unitPrice * orderQty;

    if (!itemCode || !orderQty || orderQty <= 0 || isNaN(total)) {
        alert("Please enter valid item details.");
        return;
    }

    let itemExists = false;
    $('#tblCart > tr').each(function () {
        let rowItemCode = $(this).children().eq(0).text();
        if (rowItemCode === itemCode) {
            itemExists = true;
            let existingQty = parseInt($(this).children().eq(3).text());
            let newQty = existingQty + orderQty;
            $(this).children().eq(3).text(newQty);

            let existingTotal = parseFloat($(this).children().eq(4).text());
            let newTotal = existingTotal + total;
            $(this).children().eq(4).text(newTotal.toFixed(2));
        }
    });

    if (!itemExists) {
        $('#tblCart').append(`<tr><td>${itemCode}</td><td>${description}</td><td>${unitPrice}</td><td>${orderQty}</td><td>${total.toFixed(2)}</td></tr>`);
    }

    let newQtyOnHand = parseInt($('#txtQtyOnHand').val()) - orderQty;
    $('#txtQtyOnHand').val(newQtyOnHand);

    item_array.forEach(item => {
        if (item.itemCode === itemCode) {
            item.itemQty = newQtyOnHand;
        }
    });

    $('#tblCart>tr').off('dblclick').on('dblclick', function () {
        let rowItemCode = $(this).children().eq(0).text();
        let removedQty = parseInt($(this).children().eq(3).text());
        let item = item_array.find(item => item.itemCode === rowItemCode);
        if (item) {
            item.itemQty += removedQty;
            $('#txtQtyOnHand').val(item.itemQty);
        }
        $(this).remove();
        calculateTotal();
    });

    $('#txtOrderQTY').val('');
    calculateTotal();
    disablePlaceOrder();
});
$('#btnPlaceOrder').click(function () {
    let orderDate = $('#txtDate').val();
    let cusId = $('#txtCustomerId').val();
    let orderId = $('#txtOrderId').val();

    if (!cusId) {
        alert("Please select a customer.");
        return;
    }

    if ($('#tblCart').children().length === 0) {
        alert("Cart is empty!");
        return;
    }

    let orderDetails = [];
    $('#tblCart > tr').each(function () {
        orderDetails.push(new OrderDetailsModel(
            orderId,
            $(this).children().eq(0).text(),
            $(this).children().eq(3).text(),
            $(this).children().eq(2).text()
        ));
    });

    let discount = parseFloat($('#txtDiscount').val()) || 0;
    let order = new OrderModel(orderId, orderDate, cusId, orderDetails, discount);
    order_array.push(order);
    alert("Order Placed!");

    clearFields();
    loadCustomerId();
    loadItemCode();
    generateOrderId();
    generateDate();
    disablePlaceOrder();
});
function calculateTotal() {
    let total = 0;
    $('#tblCart > tr').each(function () {
        total += parseFloat($(this).children().eq(4).text());
    });
    $('#lblTotal, #lblSubTotal').text(total.toFixed(2));
    $('#txtDiscount').val(0);
    $('#txtPayment').val(total.toFixed(2));
    $('#txtBalance').val("0.00");
}
function calculateSubTotal() {
    let total = parseFloat($('#lblTotal').text());
    let discount = parseFloat($('#txtDiscount').val()) || 0;
    let subTotal = Math.max(total - discount, 0);

    $('#lblSubTotal').text(subTotal.toFixed(2));
    $('#txtPayment').val(subTotal.toFixed(2));
    $('#txtPayment').attr('min', subTotal.toFixed(2));
    calculateBalance();
}
function calculateBalance() {
    let payment = parseFloat($('#txtPayment').val()) || 0;
    let subTotal = parseFloat($('#lblSubTotal').text());
    let balance = payment - subTotal;

    if (balance < 0) {
        $('#txtPayment').css('border', '2px solid red');
        $('#lblpayment').text(`Please enter ${subTotal.toFixed(2)} or above`).css({ 'color': 'red', 'font-size': '8px' });
        $('#txtBalance').val(balance.toFixed(2));
        disablePlaceOrder();
    } else {
        $('#txtPayment').css('border', '2px solid green');
        $('#lblpayment').text("");
        $('#txtBalance').val(balance.toFixed(2));
        enablePlaceOrder();
    }
}
$('#txtPayment').on('keyup', calculateBalance);
$('#txtDiscount').on('keyup', calculateSubTotal);
function disablePlaceOrder() {
    $('#btnPlaceOrder').attr('disabled', true);
}
function enablePlaceOrder() {
    $('#btnPlaceOrder').removeAttr('disabled');
}
function clearFields() {
    $('#txtOrderId, #txtDate, #txtCustomerId, #txtCustomerName, #txtCustomerAddress, #txtCustomerContact, #txtCustomerAge, #txtItemCode, #txtDescription, #txtQtyOnHand, #txtUnitPrice, #txtOrderQTY, #txtDiscount, #txtPayment, #txtBalance').val('');
    $('#lblTotal, #lblSubTotal').text("0.00");
    $('#tblCart').empty();
}
$('#txtOrderId').on('keydown', function (event) {
    if (event.key === "Enter") {
        $('#tblCart').empty();
        let order = searchOrder($(this).val());

        if (order) {
            $('#txtOrderId').val(order.orderId);
            $('#txtDate').val(order.orderDate);
            $('#txtCustomerId').val(order.cusCode);
            $('#txtDiscount').val(order.discount);

            let customer = searchCustomer(order.cusCode);
            if (customer) {
                $('#txtCustomerName').val(customer.cusName);
                $('#txtCustomerAddress').val(customer.cusAddress);
                $('#txtCustomerContact').val(customer.cusContact);
                $('#txtCustomerAge').val(customer.cusAge);
            }

            // Populate the cart table with order details
            order.orderDetails.forEach(detail => {
                let item = searchItem(detail.itemCode);
                if (item) {
                    let total = detail.qty * detail.unitPrice;
                    $('#tblCart').append(`
                        <tr>
                            <td>${detail.itemCode}</td>
                            <td>${item.itemName}</td>
                            <td>${detail.unitPrice.toFixed(2)}</td>
                            <td>${detail.qty}</td>
                            <td>${total.toFixed(2)}</td>
                        </tr>
                    `);
                }
            });

            calculateTotal();
            calculateSubTotal();
            enablePlaceOrder();
        } else {
            alert("Order not found!");
            clearFields();
            disablePlaceOrder();
        }
    }
});
// function clearFields() {
//     $('#txtOrderId, #txtDate, #txtCustomerId, #txtCustomerName, #txtCustomerAddress, #txtCustomerContact, #txtCustomerAge, #txtItemCode, #txtDescription, #txtQtyOnHand, #txtUnitPrice, #txtOrderQTY, #txtDiscount, #txtPayment, #txtBalance').val('');
//     $('#lblTotal, #lblSubTotal').text("0.00");
//     $('#tblCart').empty();
// }
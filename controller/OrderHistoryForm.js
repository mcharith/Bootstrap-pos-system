import OrderModel from "../models/orderModel.js";
import OrderDetailsModel from "../models/orderDetailsModel.js";
import {customer_array,item_array,order_array} from "../db/database.js";

// export let customer_array = [
//     { cusCode: "C001", cusName: "John Doe", cusAddress: "123 Street", cusContact: "123-456" }
//     // Add more sample customers if needed
// ];
//
// export let item_array = [
//     { itemCode: "I001", itemName: "Item 1", unitPrice: 100 },
//     { itemCode: "I002", itemName: "Item 2", unitPrice: 50 }
//     // Add more sample items if needed
// ];
//
// export let order_array = [
//     new OrderModel("O001", "2024-10-31", "C001", [
//         new OrderDetailsModel("O001", "I001", 100, 2),
//         new OrderDetailsModel("O001", "I002", 50, 1)
//     ], 10)
//     // Add more sample orders if needed
// ];

function searchOrder(orderId) {
    return order_array.find(order => order.orderId === orderId);
}

function searchCustomer(cusCode) {
    return customer_array.find(customer => customer.cusCode === cusCode);
}

function searchItem(itemCode) {
    return item_array.find(item => item.itemCode === itemCode);
}
$('#order-Id').on('keydown', function (event) {
    if (event.key === "Enter") {
        let orderId = $(this).val();
        let order = searchOrder(orderId);
        if (order) {
            fillOrderDetails(order);
        } else {
            alert("Order not found!");
            $('#orderDetailsTableBody').empty();
            $('#orderTableBody').empty();
        }
    }
});

function fillOrderDetails(order) {
    $('#orderDetailsTableBody').empty();
    $('#orderTableBody').empty();

    order.orderDetail.forEach(detail => {
        $('#orderDetailsTableBody').append(`
            <tr>
                <td>${order.orderId}</td> 
                <td>${detail.itemCode}</td>
                <td>${detail.price}</td>
                <td>${detail.qty}</td>
            </tr>
        `);
    });

    let customer = searchCustomer(order.cusCode);
    if (customer) {
        $('#orderTableBody').append(`
            <tr>
                <td>${order.orderId}</td>
                <td>${order.orderDate}</td> 
                <td>${order.cusCode}</td> 
                <td>${customer.cusName}</td>
                <td>${order.discount}%</td>
            </tr>
        `);
    }
}
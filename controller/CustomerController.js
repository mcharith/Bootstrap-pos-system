import CustomerModel from "../models/customerModel.js";
import { customer_array } from "../db/database.js";
let selected_customer_index = null;
const cleanCustomerForm = () => {
   $('#customerCode').val("");
   $('#customerName').val("");
   $('#customerAddress').val("");
   $('#customerAge').val("");
   $('#customerContact').val("");
}

$("#customer_save_btn").on('click', function () {
   let cusId = $("#customerCode").val();
   let cusName = $("#customerName").val();
   let cusAddress = $("#customerAddress").val();
   let cusAge = $("#customerAge").val();
   let cusContact = $("#customerContact").val();

   let res = saveCustomer(cusId,cusName,cusAddress,cusAge,cusContact);
   if (res){
      cleanCustomerForm();
   }
});

$("#customer_update_btn").on('click', function () {
   let cusId = $("#customerCode").val();
   let cusName = $("#customerName").val();
   let cusAddress = $("#customerAddress").val();
   let cusAge = $("#customerAge").val();
   let cusContact = $("#customerContact").val();

   let option = confirm(`Do you want to update: ${cusId}`);
   if (option) {
      let res = updateCustomer(cusId, cusName, cusAddress, cusAge, cusContact);
      if (res) {
         Swal.fire("Customer Updated successfully!");
         loadCustomerTable();
         cleanCustomerForm();
      } else {
         Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
         });
      }
   }
});

$("#customer-delete-btn").on('click',function (){
   let cusId = $("#customerCode").val();

   let option = confirm(`Do you want to delete: ${cusId}`);
   if (option){
      let res = deleteCustomer(cusId);
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
   loadCustomerTable();
   cleanCustomerForm();
});

$("#customer-search-btn").on('click', function () {
   let searchTerm = $(".input-group input").val().trim();
   let searchBy = $(".input-group select").val();

   let result;
   if (searchBy === "code") {
      result = searchCustomerByCode(searchTerm);
   } else if (searchBy === "name") {
      result = searchCustomerByName(searchTerm);
   }

   if (result) {
      Swal.fire({
         title: "Customer Found",
         text: `ID: ${result.cusId}, Name: ${result.cusName}, Address: ${result.cusAddress}, Age: ${result.cusAge}, Contact: ${result.cusContact}`,
         icon: "success"
      });
   } else {
      Swal.fire({
         icon: "error",
         title: "Not Found",
         text: "No customer matches the search criteria."
      });
   }
});

function searchCustomerByCode(code) {
   for (let i in customer_array) {
      if (customer_array[i].cusId === code) return customer_array[i];
   }
   return null;
}

function searchCustomerByName(name) {
   for (let i in customer_array) {
      if (customer_array[i].cusName.toLowerCase() === name.toLowerCase()) return customer_array[i];
   }
   return null;
}
function deleteCustomer(code){
   let result = searchCustomer(code);
   if (result != null){
      let number = customer_array.indexOf(result);
      customer_array.splice(number,1);
      return true;
   }else {
      return false;
   }
}
function searchCustomer(code) {
   for (var i in customer_array) {
      if (customer_array[i].cusId === code) return customer_array[i];
   }
   return null;
}
function updateCustomer(code, name, address, age, contact) {
   let customer = searchCustomer(code);
   if (customer != null) {
      customer.cusName = name;
      customer.cusAddress = address;
      customer.cusAge = age;
      customer.cusContact = contact;
      return true;
   }
   return false;
}
function saveCustomer(code,name,address,age,contact){
   let customerModel = new CustomerModel(code,name,address,age,contact);
   customer_array.push(customerModel);
   loadCustomerTable()
   // console.log(customerModel);
   return true;
}

const loadCustomerTable = () => {
   $("#customerTableBody").empty();
   customer_array.map((item, index) => {
      console.log(item);
      let data = `<tr><td>${item.cusId}</td><td>${item.cusName}</td><td>${item.cusAddress}</td><td>${item.cusAge}</td><td>${item.cusAddress}</td></tr>`
      $("#customerTableBody").append(data);
   })
}

$('#customerTableBody').on('click', 'tr', function () {
   // get tr index
   let index = $(this).index();

   selected_customer_index = $(this).index();

   // get customer object by index
   let customer_obj = customer_array[index];

   // get customer's data
   let code = customer_obj.cusId;
   let name = customer_obj.cusName;
   let address = customer_obj.cusAddress;
   let age = customer_obj.cusAge;
   let contact = customer_obj.cusContact;

   // fill data into the form
   $('#customerCode').val(code);
   $('#customerName').val(name);
   $('#customerAddress').val(address);
   $('#customerAge').val(age);
   $('#customerContact').val(contact);
});

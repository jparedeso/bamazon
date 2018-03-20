var express = require("express");
var inquirer = require("inquirer");
var app = express();
var PORT = process.env.PORT || 8080;
var mysql = require("mysql");
var choices = [];
var itemId = "";
var itemQuantity= "";

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
    itemChoices();
    start();
});

function itemChoices() {
    connection.query(
        "SELECT * FROM products", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                choices.push(results[i].item_id);
            }
        });
}

function start() {
    inquirer.prompt([
        {
            name: "itemId",
            type: "list",
            message: "What product would you like to buy?",
            choices: choices
        },
        {
            name: "itemQuantity",
            type: "input",
            message: "What quantity?"
        }
    ]).then(function(answer) {
        itemId = answer.itemId;
        itemQuantity = answer.itemQuantity;
        getItems(itemId, itemQuantity);
    });
}
function getItems(item, quantity) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE item_id = " + item, function(err, results) {
            if (err) throw err;
            if (quantity > results[0].stock_quantity) {
                console.log("There is not enough stock.");
                getItems(itemId, itemQuantity);
            } else {
                placeOrder();
            }
        });
}

function placeOrder() {
    connection.query(
        "UPDATE products SET stock_quantity -" + itemQuantity + " WHERE item_id = " +itemId, function(err, results) {
           if (err) throw err;
           var price = parseFloat(parseFloat(itemQuantity) * parseFloat(results[0].price)).toFixed(2);
           console.log("You are buying " + itemId + "x" + itemQuantity + " for $" + price + ".");
           itemId = "";
           itemQuantity = "";
           inquirer.prompt(
               {
                   name: "pick",
                   type: "list",
                   message: "Would you like to purchase anything else?",
                   choices: ["Yes", "No"]
               }
               ).then(function(answer) {
                   var pick = answer.pick;
                   switch (pick) {
                       case "Yes":
                           start();
                           break;
                       case "No":
                           connection.end();
                           break;
                   }
           });
        });
}

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
var express = require("express");
var inquirer = require("inquirer");
var app = express();
var PORT = process.env.PORT || 8080;
var mysql = require("mysql");
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
    start();
});

function start() {
    connection.query(
        "SELECT * FROM products", function(err, res) {
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "itemId",
                    type: "list",
                    message: "What product would you like to buy?",
                    choices: function() {
                        var choices = [];
                        for (var i = 0; i < res.length; i++) {
                            choices.push(res[i].product_name);
                        }
                        return choices;
                    }
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
        });
}
function getItems(item, Quantity) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE product_name = ?", item, function(err, res) {
            if (err) throw err;
            if (Quantity > res[0].stock_quantity) {
                console.log("There is not enough stock.");
                start();
            } else {
                placeOrder();
                updateStock();
            }
        });
}
function placeOrder() {
    connection.query(
        "SELECT price, product_name FROM products WHERE product_name = ?", itemId, function(err, res) {
            var price = parseFloat(parseFloat(itemQuantity) * parseFloat(res[0].price)).toFixed(2);
            console.log("You are buying " + res[0].product_name + " x " + itemQuantity + " for $" + price + ".");
        });
}
function updateStock() {
    connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " + itemQuantity + " WHERE product_name = ?", itemId, function(err, res) {
           if (err) throw err;
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
                           process.exit(-1);
                           break;
                   }
           });
        });
}

app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
var express = require("express");
var inquirer = require("inquirer");
var app = express();
var PORT = process.env.PORT || 8080;
var mysql = require("mysql");
var choices = [];

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
        var itemId = answer.itemId;
        var itemQuantity = answer.itemQuantity;
        getItems(itemId, itemQuantity);
    });
}
function getItems(item, quantity) {
    connection.query(
        "SELECT stock_quantity FROM products WHERE item_id = " + item, function() {

        });
}
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
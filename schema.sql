DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL,
    product_name VARCHAR(300),
    department_name VARCHAR(255),
    price DECIMAL(18,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);
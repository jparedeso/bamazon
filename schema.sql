DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id VARCHAR(150) NOT NULL,
    product_name VARCHAR(300),
    department_name VARCHAR(300),
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);
SELECT * FROM bamazon.products;
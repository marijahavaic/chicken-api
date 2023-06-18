CREATE DATABASE IF NOT EXISTS henhouse;
USE henhouse;

CREATE TABLE chickens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  birthday DATE NOT NULL,
  weight INT,
  steps INT,
  isRunning BOOL
);

CREATE USER 'chicken-api'@'%' IDENTIFIED BY 'GUQ5uzj.exq1pdq7fxe';
GRANT ALL PRIVILEGES ON henhouse.* TO 'chicken-api'@'%';
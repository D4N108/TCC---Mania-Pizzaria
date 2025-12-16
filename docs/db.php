<?php
$servername = "localhost";      // geralmente 'localhost' no XAMPP
$username   = "root";           // usuário do MySQL
$password   = "";               // senha do MySQL (geralmente vazio no XAMPP)
$dbname     = "pizzaria_mania";       // nome do banco que você criou

// Criar conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checar conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Opcional: definir charset para UTF-8
$conn->set_charset("utf8");

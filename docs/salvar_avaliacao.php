<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "avaliacao";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

$nome = $_POST["nome"];
$avaliacao = $_POST["avaliacao"];

// Insere cliente
$sql_cliente = "INSERT INTO clientes (nome) VALUES ('$nome')";
$conn->query($sql_cliente);

// Pega o id do cliente inserido
$id_cliente = $conn->insert_id;

// Insere avaliação vinculada ao cliente
$sql_avaliacao = "INSERT INTO avaliacoes (id_cliente, avaliacao) VALUES ($id_cliente, '$avaliacao')";
$conn->query($sql_avaliacao);

$conn->close();

echo "OK";
?>

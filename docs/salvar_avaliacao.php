<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

/* CONEXÃO */
$conn = new mysqli("localhost", "root", "", "pizzaria_mania");
if ($conn->connect_error) {
    die("erro_conexao");
}

/* RECEBE DADOS */
$name = trim($_POST['name'] ?? '');
$msg  = trim($_POST['msg'] ?? '');

/* VALIDAÇÃO REAL */
if ($msg === '') {
    die("dados_invalidos");
}

/* SE NOME VIER VAZIO */
if ($name === '') {
    $name = 'Anônimo';
}

/* INSERT */
$sql = "INSERT INTO avaliacoes (nome, mensagem) VALUES (?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("erro_prepare");
}

$stmt->bind_param("ss", $name, $msg);

if ($stmt->execute()) {
    echo "Avaliação enviada!";
} else {
    echo "erro_insert";
}

$stmt->close();
$conn->close();

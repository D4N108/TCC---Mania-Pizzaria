<?php
require "db.php";

if (!isset($_POST['msg']) || trim($_POST['msg']) === "") {
    header("Location: avaliacoes.php?erro=1");
    exit;
}

$nome = $_POST['name'];
$msg  = $_POST['msg'];

$stmt = $conn->prepare(
    "INSERT INTO avaliacoes (nome, mensagem) VALUES (?, ?)"
);
$stmt->bind_param("ss", $nome, $msg);
$stmt->execute();

header("Location: avaliacoes.php?sucesso=1");
exit;

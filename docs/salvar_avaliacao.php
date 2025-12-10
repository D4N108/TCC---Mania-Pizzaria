<?php
/* Conexão */
$pdo = new PDO("mysql:host=localhost;dbname=avaliacao;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/* Dados do formulário (name e msg) */
$nome = $_POST['name'] ?? '';
$comentario = $_POST['msg'] ?? '';

if (empty($nome) || empty($comentario)) {
    echo "Erro: campos vazios.";
    exit;
}

/* 1️⃣ Inserir cliente */
$stmt_cliente = $pdo->prepare("INSERT INTO clientes (nome) VALUES (?)");
$stmt_cliente->execute([$nome]);

$id_cliente = $pdo->lastInsertId();

/* 2️⃣ Inserir avaliação */
$stmt_avaliacao = $pdo->prepare("INSERT INTO avaliacoes (id_cliente, comentario) VALUES (?, ?)");
$stmt_avaliacao->execute([$id_cliente, $comentario]);

echo "ok";
?>

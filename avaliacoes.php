<?php
require "db.php";
$result = $conn->query(
    "SELECT nome, mensagem, data_criacao FROM avaliacoes ORDER BY id DESC"
);
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Avaliações - Pizzaria Mania</title>
  <link rel="stylesheet" href="style.css">
    <style>

        /* review form */
.review-box textarea{
  width:100%;
  min-height:90px;
  border-radius:8px;
  border:1px solid rgba(0,0,0,0.08);
  padding:10px;
}

/* Aqui adiciona: */
.review-box p {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
}

.review-box button{
  margin-top:8px;
  background:var(--red);
  color:#fff;
  padding:10px 12px;
  border-radius:8px;
  border:none;
  cursor:pointer;
}


        .btn-voltar {
    display: inline-block;
    background: var(--red);
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-voltar:hover {
    background: #d62828;
    transform: scale(1.05);
}


    </style>

</head>
<body>

<div class="location-wrap">
  <div class="loc-left" style="width:100%">

    <h2>Avaliações dos Clientes</h2>

    <?php if (isset($_GET['sucesso'])): ?>
      <div class="box" style="background:#d4edda;color:#155724">
        Avaliação enviada com sucesso ❤️
      </div>
    <?php endif; ?>

    <?php if (isset($_GET['erro'])): ?>
      <div class="box" style="background:#f8d7da;color:#721c24">
        Erro ao enviar avaliação.
      </div>
    <?php endif; ?>

    <?php while ($row = $result->fetch_assoc()): ?>
      <div class="box review-box">
        <strong><?= htmlspecialchars($row['nome']) ?></strong>
        <p><?= nl2br(htmlspecialchars($row['mensagem'])) ?></p>
        <small>
          <?= date("d/m/Y H:i", strtotime($row['data_criacao'])) ?>
        </small>
      </div>
    <?php endwhile; ?>

    <!-- Botão para voltar ao índice -->
    <div style="margin-top:20px; text-align:center;">
      <a href="index.html" class="btn-voltar">← Voltar à Página Inicial</a>
    </div>

  </div>
</div>

</body>
</html>

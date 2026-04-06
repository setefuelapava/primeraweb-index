<?php
// Script de chat v1.0 - Archivo actualizado
error_reporting(E_ALL); // Cambiar a 0 en producción, pero útil para depurar

// Permitir que tu sitio en GitHub Pages acceda a este script
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');
$file = 'chat.txt';
$now = time();

// Manejar envío de mensaje (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Limpiamos los datos y reemplazamos el separador | para evitar errores
    $nick = isset($_POST['nick']) ? str_replace('|', '', strip_tags($_POST['nick'])) : '';
    $color = isset($_POST['color']) ? str_replace('|', '', strip_tags($_POST['color'])) : '#000000';
    $msg = isset($_POST['msg']) ? str_replace('|', '', strip_tags($_POST['msg'])) : '';
    
    if (!empty($nick) && !empty($msg)) {
        $line = $now . "|" . $color . "|" . $nick . "|" . $msg . "\n";
        file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }
}

// Manejar lectura de mensajes (GET)
$messages = [];
if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $updatedContent = "";
    
    foreach ($lines as $line) {
        $parts = explode('|', trim($line));
        if (count($parts) < 4) continue;
        
        $timestamp = (int)$parts[0];
        // Solo conservar si tiene menos de 24 horas (86400 segundos)
        if ($now - $timestamp < 86400) {
            $messages[] = [
                'color' => htmlspecialchars($parts[1]), 
                'nick' => htmlspecialchars($parts[2]), 
                'msg' => htmlspecialchars($parts[3])
            ];
            $updatedContent .= $line . "\n";
        }
    }
    if (isset($updatedContent) && $updatedContent !== file_get_contents($file)) file_put_contents($file, $updatedContent, LOCK_EX); 
}
echo json_encode($messages);
?>
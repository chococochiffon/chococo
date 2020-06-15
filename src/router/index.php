<?php
require_once dirname(__FILE__).'/../../vendor/autoload.php';
use myapp\router\router;

$router = new router();
$fileName = isset($_GET['f']) ? $_GET['f'] : 'index.html';
$router->load($fileName);
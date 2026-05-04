<?php
    declare(strict_types=1);

    /* HomeController - handles the front page logic */

    class HomeController
    {
        public function index(string $baseUrl): void
        {
            require ROOT . '/views/home/index.php';
        }
    }
?>

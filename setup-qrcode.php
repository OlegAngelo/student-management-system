<?php
    /**
     * Setup phpqrcode library - Alternative method without ZipArchive.
     */

    $libDir = __DIR__ . '/lib';
    $qrcodeDir = $libDir . '/phpqrcode';

    echo "Setting up QR code library...\n";

    // Create lib directory
    if (!is_dir($libDir)) {
        mkdir($libDir, 0755, true);
        echo "✓ Created lib directory\n";
    }

    // Check if already installed
    if (file_exists($qrcodeDir . '/src/QRCode.php')) {
        echo "✓ phpqrcode is already installed\n";
        exit(0);
    }

    echo "\nManual Installation Required:\n";
    echo "================================\n\n";
    echo "Your PHP doesn't have ZipArchive enabled. Follow these steps:\n\n";
    echo "1. Download: https://github.com/chillerlan/php-qrcode/archive/main.zip\n\n";
    echo "2. Extract the ZIP file\n\n";
    echo "3. Copy the 'php-qrcode-main' folder to:\n";
    echo "   " . $qrcodeDir . "\n\n";
    echo "   (Rename 'php-qrcode-main' to 'phpqrcode')\n\n";
    echo "4. Verify the structure:\n";
    echo "   " . $qrcodeDir . "/src/QRCode.php should exist\n\n";
    echo "After manual setup, test by viewing the QR modal again.\n";

    exit(1);
?>

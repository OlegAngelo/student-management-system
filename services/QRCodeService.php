<?php
    declare(strict_types=1);

    /**
     * QRCodeService - handles QR code generation for students.
     * Uses server-side generation with the php-qrcode library.
     */
    class QRCodeService
    {
        private static bool $libraryLoaded = false;

        /**
         * Generates a unique QR code payload based on student ID.
         * Format: student-management:STUDENT_ID
         *
         * @param string $studentId
         * @return string
         */
        public static function buildPayload(string $studentId): string
        {
            return 'student-management:' . $studentId;
        }

        /**
         * Generates a QR code image as PNG bytes.
         *
         * @param string $studentId
         * @return string Binary PNG data
         */
        public static function generatePNG(string $studentId): string
        {
            self::ensureLibraryLoaded();

            $payload = self::buildPayload($studentId);

            try {
                $options = new \chillerlan\QRCode\QROptions([
                    'version' => \chillerlan\QRCode\QROptions::VERSION_AUTO,
                    'errorCorrectLevel' => \chillerlan\QRCode\QROptions::ECC_L,
                    'outputType' => \chillerlan\QRCode\QROptions::OUTPUT_IMAGE_PNG,
                    'imageBase64' => false,
                ]);

                $qr = new \chillerlan\QRCode\QRCode($options);
                return $qr->render($payload);
            } catch (\Exception $e) {
                throw new \RuntimeException('Failed to generate QR code: ' . $e->getMessage());
            }
        }

        /**
         * Generates a data URL for displaying QR in browser.
         *
         * @param string $studentId
         * @return string Data URL
         */
        public static function getImageDataUrl(string $studentId): string
        {
            $pngData = self::generatePNG($studentId);
            return 'data:image/png;base64,' . base64_encode($pngData);
        }

        /**
         * Ensures the QRCode library is loaded and autoloader is registered.
         *
         * @return void
         */
        private static function ensureLibraryLoaded(): void
        {
            if (self::$libraryLoaded) {
                return;
            }

            $libPath = ROOT . '/lib/phpqrcode';

            if (!is_dir($libPath) || !file_exists($libPath . '/src/QRCode.php')) {
                throw new \RuntimeException(
                    'QR Code library not found. Install it by: ' .
                    'downloading https://github.com/chillerlan/php-qrcode/archive/main.zip ' .
                    'and extracting to lib/phpqrcode'
                );
            }

            // Register a simple PSR-4 autoloader for the library
            spl_autoload_register(function (string $class): void {
                if (strpos($class, 'chillerlan\\QRCode') !== 0) {
                    return;
                }

                $path = ROOT . '/lib/phpqrcode/src/' . str_replace('\\', '/', substr($class, 17)) . '.php';

                if (file_exists($path)) {
                    require_once $path;
                }
            });

            self::$libraryLoaded = true;
        }
    }
?>

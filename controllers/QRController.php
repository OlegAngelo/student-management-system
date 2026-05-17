<?php
    declare(strict_types=1);

    /**
     * QRController - handles QR code endpoints.
     * Provides endpoints for viewing and downloading student QR codes.
     */
    class QRController
    {
        /**
         * GET /qr/download/:student_id
         * Downloads a QR code image as PNG file.
         *
         * @param string $baseUrl
         * @return void
         */
        public function download(string $baseUrl): void
        {
            $studentId = trim($_GET['student_id'] ?? '');

            if (!$studentId) {
                http_response_code(400);
                echo 'student_id parameter is required';
                return;
            }

            try {
                $imageData = QRCodeService::generatePNG($studentId);

                header('Content-Type: image/png');
                header('Content-Disposition: attachment; filename="qr-' . $studentId . '.png"');
                header('Content-Length: ' . strlen($imageData));
                header('Cache-Control: no-cache, no-store, must-revalidate');

                echo $imageData;
            } catch (\Exception $e) {
                http_response_code(500);
                echo 'Failed to generate QR code';
            }
        }

        /**
         * GET /qr/image-url/:student_id
         * Returns QR code image as data URL (for displaying in browser).
         *
         * @param string $baseUrl
         * @return void
         */
        public function imageUrl(string $baseUrl): void
        {
            header('Content-Type: application/json; charset=utf-8');

            $studentId = trim($_GET['student_id'] ?? '');

            if (!$studentId) {
                http_response_code(400);
                echo json_encode(['error' => 'student_id parameter is required'], JSON_UNESCAPED_UNICODE);
                return;
            }

            try {
                $dataUrl = QRCodeService::getImageDataUrl($studentId);
                echo json_encode(['url' => $dataUrl], JSON_UNESCAPED_UNICODE);
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
            }
        }
    }
?>

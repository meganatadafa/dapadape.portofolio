<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Set header untuk JSON response
header('Content-Type: application/json');

// Cek apakah request method adalah POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Ambil data dari form
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validasi data
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi!']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Format email tidak valid!']);
        exit;
    }

    // Inisialisasi PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Konfigurasi SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'ariesteeven@gmail.com'; // Email Gmail Anda
        $mail->Password   = 'uczqjubazwzboxxd'; // App Password Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Enable debug jika masih error (comment setelah berhasil)
        // $mail->SMTPDebug = 2;

        // Set charset
        $mail->CharSet = 'UTF-8';

        // Pengaturan email - PENTING: setFrom harus menggunakan email yang sama dengan Username
        $mail->setFrom('ariesteeven@gmail.com', 'Portfolio Contact Form'); // Gunakan email Anda sendiri
        $mail->addAddress('ariesteeven@gmail.com'); // Email tujuan (Anda)
        $mail->addReplyTo($email, $name); // Reply to email pengirim

        // Konten email
        $mail->isHTML(true);
        $mail->Subject = "Pesan dari $name - Portfolio Contact Form";
        $mail->Body    = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f4f4f4; padding: 20px; border-radius: 0 0 10px 10px; }
                    .info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #7c3aed; }
                    .label { font-weight: bold; color: #333; }
                    .value { color: #666; margin-top: 5px; }
                    .message-box { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; min-height: 100px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>📧 Pesan Baru dari Portfolio</h2>
                    </div>
                    <div class='content'>
                        <div class='info'>
                            <div class='label'>👤 Nama:</div>
                            <div class='value'>$name</div>
                        </div>
                        <div class='info'>
                            <div class='label'>📧 Email:</div>
                            <div class='value'>$email</div>
                        </div>
                        <div class='info'>
                            <div class='label'>💬 Pesan:</div>
                            <div class='message-box'>$message</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        ";

        $mail->AltBody = "Pesan Baru dari Portfolio\n\nNama: $name\nEmail: $email\n\nPesan:\n$message";

        // Kirim email
        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Pesan berhasil dikirim! Terima kasih telah menghubungi saya.']);
    } catch (Exception $e) {
        // Log error untuk debugging
        error_log("PHPMailer Error: " . $mail->ErrorInfo);
        echo json_encode(['status' => 'error', 'message' => 'Pesan gagal dikirim. Silakan coba lagi atau hubungi via email langsung.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

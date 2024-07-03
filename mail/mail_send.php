<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $phone = htmlspecialchars($_POST['phone']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    $agree = isset($_POST['agree']) ? 'Yes' : 'No';

    $to = "zayavki-krown@yandex.ru, feedback@vip-finance.ru"; // Замените на ваш email
    $subject = "vip-finance.ru Новое обращение от гражданина";
    $body = "Имя: $name\nТелефон: $phone\nEmail: $email\nСогласие: $agree\n\nСообщение:\n$message";

    // Уникальная граница для MIME-сообщения
    $boundary = md5(uniqid(time()));


    // Заголовки письма для администратора
    $headers = "From: no-reply@vip-finance.ru\r\n"; // Замените на ваш домен
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $messageAdmin = "--$boundary\r\n";
    $messageAdmin .= "Content-Type: text/plain; charset=utf-8\r\n";
    $messageAdmin .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $messageAdmin .= "$body\r\n\r\n";
  
    // Обработка загруженных файлов
    $files = $_FILES['file'];
    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] == UPLOAD_ERR_OK) {
            $tmp_name = $files['tmp_name'][$i];
            $file_name = $files['name'][$i];
            $file_content = chunk_split(base64_encode(file_get_contents($tmp_name)));
            $messageAdmin .= "--$boundary\r\n";
            $messageAdmin .= "Content-Type: application/octet-stream; name=\"$file_name\"\r\n";
            $messageAdmin .= "Content-Transfer-Encoding: base64\r\n";
            $messageAdmin .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
            $messageAdmin .= "$file_content\r\n\r\n";
        } else {
            error_log("Ошибка при загрузке файла: " . $files['error'][$i]);
        }
    }

    $messageAdmin .= "--$boundary--";

    // Отправка письма администратору
    $mailSuccessAdmin = mail($to, $subject, $messageAdmin, $headers);
    if (!$mailSuccessAdmin) {
        error_log("Ошибка при отправке письма администратору.");
    }

    // Заголовки письма для пользователя
    $userSubject = "Ваше обращение получено";
    $userBody = "Здравствуйте, $name!\n\nВаше обращение было успешно получено. Вот информация, которую вы оставили:\n\n$body\n\nС уважением,\nКоманда поддержки.";
    $userHeaders = "From: no-reply@vip-finance.ru\r\n"; // Замените на ваш домен
    $userHeaders .= "Reply-To: no-reply@vip-finance.ru\r\n";
    $userHeaders .= "MIME-Version: 1.0\r\n";
    $userHeaders .= "Content-Type: text/plain; charset=utf-8\r\n";

    // Отправка письма пользователю
    $mailSuccessUser = mail($email, $userSubject, $userBody, $userHeaders);
    if (!$mailSuccessUser) {
        error_log("Ошибка при отправке письма пользователю.");
    }

    if ($mailSuccessAdmin && $mailSuccessUser) {
        echo "Сообщение успешно отправлено.";
    } else {
        echo "Ошибка при отправке сообщения.";
    }
} else {
    echo "Неверный метод отправки.";
}
?>

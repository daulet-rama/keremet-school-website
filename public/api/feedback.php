<?php
/**
 * Keremet School — form handler (feedback / director blog / admission request).
 * POST from main.js (FormData). Replies JSON: {"ok":true} or {"ok":false,"error":"code"}.
 * Security: POST only, honeypot ("website"), field validation, length limits, header-injection safe,
 * minimum fill time ("elapsed" field set by main.js), rate limit per IP (file-based, hashed IP), UTF-8 mail.
 * No cookies / sessions are used. No data is stored except hashed-IP rate-limit stamps.
 */

// ============================== CONFIG ==============================
$CONFIG = [
    'to'          => 'info@keremet.edu.kz',   // TODO(school): confirm the official mailbox
    'from'        => 'no-reply@keremet.edu.kz', // must be a mailbox on this domain (SPF)
    'subject'     => 'keremet.edu.kz — ',
    'rate_window' => 600,   // seconds
    'rate_max'    => 5,     // max submissions per IP per window
    'min_seconds' => 3,     // submissions faster than this after page load are treated as bots ("elapsed" field, seconds)
    'allowed_origins' => ['https://keremet.edu.kz', 'https://www.keremet.edu.kz'],
];
// ===================================================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function reply(bool $ok, string $error = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply(false, 'method', 405);

// Same-origin check (when the browser sends Origin)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array(rtrim($origin, '/'), $CONFIG['allowed_origins'], true)) reply(false, 'origin', 403);

// Honeypot: bots fill every field. Pretend success.
if (!empty($_POST['website'])) reply(true);

// Too fast to be a human (main.js sends seconds since page load). Missing field (no JS) → not checked.
$elapsed = $_POST['elapsed'] ?? '';
if (is_string($elapsed) && $elapsed !== '' && ctype_digit($elapsed) && (int) $elapsed < $CONFIG['min_seconds']) reply(true);

// ------------------------------------------------------------ rate limit (IP file)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'keremet-rl';
if (!is_dir($dir)) @mkdir($dir, 0700, true);
$file = $dir . DIRECTORY_SEPARATOR . hash('sha256', $ip . '|keremet') . '.json';
$now = time();
$stamps = [];
if (is_file($file)) {
    $stamps = json_decode((string) @file_get_contents($file), true) ?: [];
    $stamps = array_values(array_filter($stamps, fn($t) => is_int($t) && $t > $now - $CONFIG['rate_window']));
}
if (count($stamps) >= $CONFIG['rate_max']) reply(false, 'rate', 429);


// ------------------------------------------------------------ input
function field(string $name, int $max = 200): string {
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = trim(str_replace(["\r\n", "\r"], "\n", $v));
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr($v, 0, $max, 'UTF-8');
}
$oneLine = fn(string $s): string => trim(preg_replace('/\s+/u', ' ', $s) ?? '');

$kind    = in_array(field('kind', 20), ['feedback', 'blog', 'admission'], true) ? field('kind', 20) : 'feedback';
$lang    = in_array(field('lang', 2), ['kz', 'ru', 'en'], true) ? field('lang', 2) : 'kz';
$name    = $oneLine(field('name'));
$email   = $oneLine(field('email'));
$phone   = $oneLine(field('phone', 40));
$topic   = $oneLine(field('topic', 40));
$message = field('message', 5000);
$child   = $oneLine(field('child'));
$birth   = $oneLine(field('birth', 10));
$grade   = $oneLine(field('grade', 40));
$instr   = $oneLine(field('instr', 4));
$publish = !empty($_POST['publish']);
$page    = $oneLine(field('page', 300));
$consent = !empty($_POST['consent']);

// ------------------------------------------------------------ validation
$errors = [];
if (!$consent) $errors[] = 'consent';
if ($name === '' || mb_strlen($name) < 2) $errors[] = 'name';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($phone !== '' && strlen(preg_replace('/\D/', '', $phone)) < 10) $errors[] = 'phone';
switch ($kind) {
    case 'admission':
        if ($phone === '') $errors[] = 'phone';
        if ($child === '') $errors[] = 'child';
        if ($grade === '') $errors[] = 'grade';
        if ($birth !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birth)) $errors[] = 'birth';
        break;
    case 'blog':
        if ($email === '') $errors[] = 'email';
        if (mb_strlen($message) < 10) $errors[] = 'message';
        break;
    default:
        if ($email === '') $errors[] = 'email';
        if (mb_strlen($message) < 10) $errors[] = 'message';
}
if ($errors) reply(false, 'invalid:' . implode(',', array_unique($errors)), 422);

// ------------------------------------------------------------ compose mail
$titles = ['feedback' => 'Обращение', 'blog' => 'Вопрос директору', 'admission' => 'Заявка на приём'];
$lines = [
    'Тип: ' . $titles[$kind],
    'Язык страницы: ' . $lang,
    'Имя / ФИО: ' . $name,
    'E-mail: ' . ($email ?: '—'),
    'Телефон: ' . ($phone ?: '—'),
];
if ($kind === 'feedback') $lines[] = 'Тема: ' . ($topic ?: '—');
if ($kind === 'admission') {
    $lines[] = 'Ребёнок: ' . $child;
    $lines[] = 'Дата рождения: ' . ($birth ?: '—');
    $lines[] = 'Класс: ' . $grade;
    $lines[] = 'Язык обучения: ' . ($instr ?: '—');
}
if ($kind === 'blog') $lines[] = 'Согласие на публикацию: ' . ($publish ? 'да' : 'нет');
$lines[] = '';
$lines[] = 'Сообщение:';
$lines[] = $message ?: '—';
$lines[] = '';
$lines[] = '---';
$lines[] = 'Страница: ' . $page;
$lines[] = 'Дата: ' . date('d.m.Y H:i') . ' · IP: ' . $ip;
$lines[] = 'Согласие на обработку персональных данных: да';
$body = implode("\n", $lines);

$subject = '=?UTF-8?B?' . base64_encode($CONFIG['subject'] . $titles[$kind] . ($name ? ' — ' . $name : '')) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: =?UTF-8?B?' . base64_encode('Сайт Keremet') . '?= <' . $CONFIG['from'] . '>',
];
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) $headers[] = 'Reply-To: ' . $email; // validated → no header injection

$sent = @mail($CONFIG['to'], $subject, $body, implode("\r\n", $headers));
if (!$sent) reply(false, 'mail', 502);

// record stamp only on success
$stamps[] = $now;
@file_put_contents($file, json_encode($stamps), LOCK_EX);

reply(true);

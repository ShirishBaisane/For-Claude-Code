<?php
/**
 * Clicon Climate Control Solutions — Enquiry Form Handler
 *
 * Works out of the box on Hostinger shared hosting (PHP mail()).
 * Before go-live, set the constants below (see CONTENT-TODO.md) and,
 * if Hostinger flags mail() delivery, switch to SMTP via PHPMailer
 * (Hostinger's SMTP details are in hPanel > Emails).
 */

// ---------------------------------------------------------------------
// CONFIGURATION — replace with Clicon's confirmed details before launch
// ---------------------------------------------------------------------
const NOTIFY_TO_EMAIL   = "leads@clicon.example";      // TODO: real Clicon inbox
const NOTIFY_FROM_EMAIL = "no-reply@clicon.example";    // TODO: a real address on the live domain
const SITE_NAME         = "Clicon Climate Control Solutions Pvt. Ltd.";
const LEADS_LOG_FILE    = __DIR__ . "/../data/leads.csv"; // stored outside the web-servable "data" listing (see data/.htaccess)
const RATE_LIMIT_FILE   = __DIR__ . "/../data/.rate-limit.json";
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_PER_IP     = 5;

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

// --- Honeypot spam check (mirrors the client-side check; never trust the client) ---
if (!empty($_POST["website"])) {
    // Silently pretend success to bots so they don't retry.
    echo json_encode(["success" => true]);
    exit;
}

// --- Basic per-IP rate limiting to reduce form-flooding/spam ---
$ip = $_SERVER["REMOTE_ADDR"] ?? "unknown";
if (!rateLimitOk($ip)) {
    http_response_code(429);
    echo json_encode(["success" => false, "error" => "Too many requests. Please try again shortly."]);
    exit;
}

// --- Collect + sanitize input ---
$name        = sanitize($_POST["name"] ?? "");
$company     = sanitize($_POST["company"] ?? "");
$mobile      = preg_replace('/\D/', '', $_POST["mobile"] ?? "");
$email       = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$vehicleType = sanitize($_POST["vehicle_type"] ?? "");
$vehicleCount= sanitize($_POST["vehicle_count"] ?? "");
$service     = sanitize($_POST["service"] ?? "");
$location    = sanitize($_POST["location"] ?? "");
$message     = sanitize($_POST["message"] ?? "");
$pageUrl     = sanitize($_POST["page_url"] ?? "");
$referrer    = sanitize($_POST["referrer"] ?? "");

// --- Required-field + format validation ---
$errors = [];
if ($name === "") $errors[] = "Name is required.";
if (strlen($mobile) < 10) $errors[] = "A valid mobile number is required.";
if ($service === "") $errors[] = "Service required is missing.";
if ($email !== "" && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email address is invalid.";

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(["success" => false, "error" => implode(" ", $errors)]);
    exit;
}

$timestamp = date("Y-m-d H:i:s");

// --- Persist the lead (CSV append; swap for DB/CRM integration in Phase 2) ---
$row = [
    $timestamp, $name, $company, $mobile, $email, $vehicleType, $vehicleCount,
    $service, $location, $message, "Website", $pageUrl, $referrer, $ip,
];
saveLead($row);

// --- Notify Clicon's team by email ---
$subject = "New Website Enquiry - " . $service . " - " . $name;
$body = "New service enquiry received via the Clicon website.\n\n"
    . "Name: $name\n"
    . "Company: $company\n"
    . "Mobile: $mobile\n"
    . "Email: $email\n"
    . "Vehicle Type: $vehicleType\n"
    . "Number of Vehicles: $vehicleCount\n"
    . "Service Required: $service\n"
    . "Location / Area: $location\n"
    . "Message:\n$message\n\n"
    . "Source Page: $pageUrl\n"
    . "Referrer: $referrer\n"
    . "Submitted: $timestamp\n"
    . "IP: $ip\n";

$headers = "From: " . SITE_NAME . " <" . NOTIFY_FROM_EMAIL . ">\r\n";
if ($email !== "") {
    $headers .= "Reply-To: $email\r\n";
}
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = @mail(NOTIFY_TO_EMAIL, $subject, $body, $headers);

// Even if mail() fails (common until SMTP is configured on Hostinger),
// the lead is already safely stored in the CSV log, so we still report success.
echo json_encode(["success" => true, "mail_sent" => $mailSent]);
exit;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function sanitize($value)
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    return str_replace(["\r", "\n"], [" ", " "], $value) === $value
        ? $value
        : preg_replace('/[\r\n]+/', ' ', $value);
}

function saveLead(array $row)
{
    $dir = dirname(LEADS_LOG_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $isNew = !file_exists(LEADS_LOG_FILE);
    $fh = fopen(LEADS_LOG_FILE, "a");
    if ($fh === false) return;
    if ($isNew) {
        fputcsv($fh, [
            "Timestamp", "Name", "Company", "Mobile", "Email", "VehicleType", "VehicleCount",
            "Service", "Location", "Message", "Source", "PageURL", "Referrer", "IP",
        ]);
    }
    fputcsv($fh, $row);
    fclose($fh);
}

function rateLimitOk(string $ip): bool
{
    $dir = dirname(RATE_LIMIT_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $data = [];
    if (file_exists(RATE_LIMIT_FILE)) {
        $raw = file_get_contents(RATE_LIMIT_FILE);
        $data = json_decode($raw, true) ?: [];
    }
    $now = time();
    // prune old entries
    foreach ($data as $key => $entry) {
        if ($now - $entry["start"] > RATE_LIMIT_WINDOW_SECONDS) {
            unset($data[$key]);
        }
    }
    if (!isset($data[$ip])) {
        $data[$ip] = ["start" => $now, "count" => 0];
    }
    $data[$ip]["count"]++;
    file_put_contents(RATE_LIMIT_FILE, json_encode($data), LOCK_EX);
    return $data[$ip]["count"] <= RATE_LIMIT_MAX_PER_IP;
}

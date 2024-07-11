<?php
header('Content-Type: application/json');

// CORS-Header hinzufügen
// header('Access-Control-Allow-Origin: 192.168.0.121:8000');  // Erlaubt nur Anfragen von diesem Frontend-Server
header('Access-Control-Allow-Origin: *');  // Erlaubt nur Anfragen von diesem Frontend-Server
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');  // Erlaubte HTTP-Methoden
header('Access-Control-Allow-Headers: Content-Type');  // Erlaubte Header

function connect()
{
    $dsn = "mysql:host=192.168.0.110;dbname=cats;charset=utf8";  // Passe diesen Wert an deine Datenbankkonfiguration an
    $username = "flo";
    $password = "";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,  // Fehler als Ausnahme behandeln
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  // Standardmäßiger Fetch-Modus: assoziatives Array
        PDO::ATTR_EMULATE_PREPARES => false,  // Verwendung von echten Prepared Statements
    ];
    try {
        $conn = new PDO($dsn, $username, $password, $options);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        http_response_code(500);  // Internal Server Error
        echo json_encode(["error" => "Verbindung fehlgeschlagen: " . $e->getMessage()]);
        exit;
    }
}

function handle_cat($uri, $pdo)
{
    if ($uri == 'cats') {
        $stmt = $pdo->query("SELECT * FROM cat");
        $cats = $stmt->fetchAll();
        echo json_encode($cats);
    } elseif (preg_match('/^cats\/(\d+)$/', $uri, $matches)) {
        $catId = $matches[1];
        $stmt = $pdo->prepare("SELECT * FROM cat WHERE id = :id");
        $stmt->execute(['id' => $catId]);
        $cat = $stmt->fetch();
        if ($cat) {
            echo json_encode($cat);
        } else {
            http_response_code(404);  // Not Found
            echo json_encode(["error" => "Katze nicht gefunden"]);
        }
    }
}

function handle_ate($uri, $pdo)
{
    if ($uri === 'ate') {
        $stmt = $pdo->query("SELECT * FROM ate");
        $ate = $stmt->fetchAll();
        echo json_encode($ate);
    } elseif ($uri === 'ate/today') {
        $stmt = $pdo->query("SELECT * FROM ate WHERE date(time) = CURDATE()");
        $ate = $stmt->fetchAll();
        echo json_encode($ate);
    } elseif (preg_match('/^ate\/today\/(.+)$/', $uri, $matches)) {
        $cat = $matches[1];
        $stmt = $pdo->prepare("SELECT id, time FROM ate WHERE date(time) = CURDATE() AND cat_name = :cat");
        $stmt->execute(['cat' => $cat]);
        $ate = $stmt->fetchAll();
        echo json_encode($ate);
    } elseif (preg_match('/^ate\/(.+)$/', $uri, $matches)) {
        $cat = $matches[1];
        $stmt = $pdo->prepare("SELECT time FROM ate WHERE cat_name = :cat");
        $stmt->execute(['cat' => $cat]);
        $ate = $stmt->fetchAll();
        echo json_encode($ate);
    }
}

function feed($uri, $pdo)
{
    // if (preg_match('/^feed\/(.+)$/', $uri, $matches)) {
    if ($uri == 'feed') {
        // Get the request body data
        $cat = json_decode(file_get_contents('php://input'), true)['cat'];
        $timezone = new DateTimeZone('Europe/Berlin');
        $time = new DateTime('now', $timezone);
        $time = $time->format('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO ate (cat_name, time) VALUES (:cat, :time)");
        $stmt->execute(['cat' => $cat, 'time' => $time]);
        echo json_encode("Katze gefuettert");
    } else {
        http_response_code(404);  // Not Found
        echo json_encode(["error" => "Nicht gefunden"]);
    }
}

// Erstelle eine Verbindung
$pdo = connect();

// API-Endpunkte
$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = trim($_SERVER['REQUEST_URI'], '/');
$uri = str_replace('api/', '', $uri);

switch ($requestMethod) {
    case 'OPTIONS':
        exit;  // Beendet die Anfrage für OPTIONS-Requests
    case 'GET':
        if (preg_match('/^cats/', $uri)) {
            handle_cat($uri, $pdo);
        } elseif (preg_match('/^ate/', $uri)) {
            handle_ate($uri, $pdo);
        } else {
            http_response_code(404);  // Not Found
            echo json_encode(["error" => "Nicht gefunden"]);
        }
        break;

    case 'POST':
        feed($uri, $pdo);
        break;

    case 'DELETE':
        if (preg_match('/^uneat\/(\d+)$/', $uri, $matches)) {
            $ate_id = $matches[1];
            $stmt = $pdo->prepare("DELETE FROM ate WHERE id = :id");
            $stmt->execute(['id' => $ate_id]);
            echo json_encode(["success" => "Kodze gegodzt"]);
        } else {
            http_response_code(404);  // Not Found
            echo json_encode(["error" => "Nicht gefunden"]);
        }
        break;

    default:
        http_response_code(405);  // Method Not Allowed
        echo json_encode(["error" => "Methode nicht erlaubt"]);
        break;
}

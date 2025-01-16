<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, PUT, DELETE, GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        createPengaduan();
        break;

    case 'PUT':
        UpdatePengaduan();
        break;

    case 'DELETE':
        deletePengaduan();
        break;

    case 'GET':
        getPengaduan();
        break;

    default:
        echo json_encode(['message' => 'Invalid Request']);
        break;
}

// Create a new Task
function createPengaduan()
{
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->nama) && !empty($data->complain) && !empty($data->status)) {
        $conn = getConnection();
        $stmt = $conn->prepare("INSERT INTO pengaduan_warga (nama,complain, status) VALUES (?,?,?)");
        $stmt->bind_param('sss', $data->nama,$data->complain,$data->status);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Task Created']);
        } else {
            echo json_encode(['message' => 'Task Not Created']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'Incomplete Data']);
    }
}

// Mark a Task as Completed
function UpdatePengaduan()
{
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->id)) {
        $conn = getConnection();
    
        // Query untuk update data
        $stmt = $conn->prepare("UPDATE pengaduan_warga SET nama = ?, complain = ?, status = ? WHERE id = ?");
        $stmt->bind_param('sssi', $data->nama, $data->complain, $data->status, $data->id);
    
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Data updated successfully']);
        } else {
            echo json_encode(['message' => 'Failed to update data']);
        }
    
        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'Invalid ID']);
    }
}

// Delete a Task
function deletePengaduan()
{
    $data = json_decode(file_get_contents("php://input"));
    if (!empty($data->id)) {
        $conn = getConnection();
        $stmt = $conn->prepare("DELETE FROM pengaduan_warga WHERE id = ?");
        $stmt->bind_param('i', $data->id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Task Deleted']);
        } else {
            echo json_encode(['message' => 'Task Not Deleted']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['message' => 'Invalid ID']);
    }
}

// Get Tasks (Retrieve all or one by ID)
function getPengaduan()
{
    $conn = getConnection();

    // Check if task ID is provided in the query string
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM pengaduan_warga WHERE id = ?");
        $stmt->bind_param('i', $id);
    } else {
        $stmt = $conn->prepare("SELECT * FROM pengaduan_warga");
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // If there are results, fetch them and return as JSON
    if ($result->num_rows > 0) {
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
    } else {
        echo json_encode(['message' => 'No Pengaduan Found']);
    }

    $stmt->close();
    $conn->close();
}
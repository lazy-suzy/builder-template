<?php

require('constants.php');
require('database.php');

$db = new databaseClass(DB_SERVER_URL, DB_SERVER_USERNAME, DB_SERVER_PASSWORD, DB_SERVER_DATABASE);

function mimeToText($mime) {
    $mime_map = ['image/bmp' => 'bmp', 'image/x-bmp' => 'bmp', 'image/x-bitmap' => 'bmp', 'image/x-xbitmap' => 'bmp', 'image/x-win-bitmap' => 'bmp', 'image/x-windows-bmp' => 'bmp', 'image/ms-bmp' => 'bmp', 'image/x-ms-bmp' => 'bmp', 'image/gif' => 'gif', 'image/x-icon' => 'ico', 'image/x-ico' => 'ico', 'image/vnd.microsoft.icon' => 'ico', 'image/jpx' => 'jp2', 'image/jpm' => 'jp2', 'image/jpeg' => 'jpeg', 'image/pjpeg' => 'jpeg', 'image/png' => 'png', 'image/x-png' => 'png', 'image/tiff' => 'tiff'];

    return $mime_map[$mime] ?? false;
}

function generateGUID() {
    $s = strtoupper(md5(uniqid(rand(), true)));
    $guidText = substr($s, 0, 8) . '-' . substr($s, 8, 4) . '-' . substr($s, 12, 4) . '-' . substr($s, 16, 4) . '-' . substr($s, 20);

    return $guidText;
}

function removeBackground($db, $user_id, $asset_id) {
    $assetQueryID = (int) $user_id;

    // Fetch the object from database
    $asset = $db->selectOne('*', 'asset', ['asset_id' => $asset_id]);
    // Check if object is valid with the required feild
    if ($asset && empty($asset['transparent_path'])) {

        // Get the transparent image
        if (ENVIROMENT == 'DEV') {
            $response = file_get_contents('response.png');
        } elseif (ENVIROMENT == 'PROD') {
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => 'https://api.remove.bg/v1.0/removebg',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS => [
                'image_url' => PROJECT_URL . $asset['path'],
                'format' => 'png',
            ], CURLOPT_HTTPHEADER => ['X-API-Key: ' . REMOVE_BG_API_KEY], ]);
            $response = curl_exec($curl);
            curl_close($curl);
        }

        $asset['transparent_path'] = STORAGE_FOLDER_PATH . '/' . generateGUID() . '.png';
        if (file_put_contents($asset['transparent_path'], $response)) {
            // Update database
            $db->update('asset', ['transparent_path' => $asset['transparent_path']], ['asset_id' => $asset_id]);
        }
    }

    // Return response
    return $asset;
}

function moveImageAndInsert($db, $user_id, $filePath, $additionalData = []) {
    $imageMeta = getimagesize($filePath);

    if (isset($imageMeta['mime'])) {
        $imageExtension = mimeToText($imageMeta['mime']);
        // is a valid image file
        if ($imageExtension) {
            $newFileName = generateGUID() . '.' . $imageExtension;

            if (rename($filePath, realpath(STORAGE_FOLDER_PATH) . DIRECTORY_SEPARATOR . $newFileName)) {
                chmod(realpath(STORAGE_FOLDER_PATH) . DIRECTORY_SEPARATOR . $newFileName, 0644);
                $insertArray = ['user_id' => $user_id, 'path' => STORAGE_FOLDER_PATH . '/' . $newFileName];

                if (!empty($additionalData) && is_array($additionalData)) {
                    $insertArray = array_merge($insertArray, $additionalData);
                }

                $insertID = $db->insert('asset', $insertArray);
                if ($insertID) {
                    return $db->selectOne('*', 'asset', ['asset_id' => $insertID]);
                }
            }
        } else {
            unlink($filePath);
        }
    } else {
        unlink($filePath);
    }
};

function fetchImage($db, $user_id, $url, $additionalData = []) {
    $remoteImage = file_get_contents($url, false, stream_context_create([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]));

    $filePath = realpath(STORAGE_FOLDER_PATH);
    $fileName = generateGUID();

    $completeFilePath = $filePath . DIRECTORY_SEPARATOR . $fileName;

    if (file_put_contents($completeFilePath, $remoteImage)) {
        return moveImageAndInsert($db, $user_id, $completeFilePath, $additionalData);
    }
};

$response = false;

$operation = $_POST['operation'] ?? false;

$column = $_POST['column'] ?? '*';
$entity = $_POST['entity'] ?? false;
$where = $_POST['where'] ?? [];
$data = $_POST['data'] ?? [];
$order = $_POST['order'] ?? '';

if ($operation) {
    if ($entity) {
        if ($operation == 'select') {
            $response = $db->select($column, $entity, $where, $order);
        } elseif ($operation == 'update' && !empty($where)) {
            $response = $db->update($entity, $data, $where);
        } elseif ($operation == 'insert' && !empty($data)) {
            $response = $db->insert($entity, $data);
        } elseif ($operation == 'delete' && !empty($data)) {
            $response = $db->delete($entity, $where);
        }
    } else {
        if ($operation == 'fetch' && isset($_POST['user_id']) && isset($_POST['url'])) {
            $response = fetchImage($db, $_POST['user_id'], $_POST['url'], $data);
        } elseif ($operation == 'file' && isset($_POST['user_id']) && isset($_FILES['file']['tmp_name'])) {
            $response = moveImageAndInsert($db, $_POST['user_id'], $_FILES['file']['tmp_name'], $data);
        } elseif ($operation == 'transparent' && isset($_POST['user_id']) && isset($_POST['asset_id'])) {
            $response = removeBackground($db, $_POST['user_id'], $_POST['asset_id']);
        }
    }
}

echo header('Content-Type: application/json');
echo json_encode($response);

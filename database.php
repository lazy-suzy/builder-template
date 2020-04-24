<?php

class databaseClass {
    private $connection;

    public function __construct($serverName, $username, $password, $db) {
        $this -> connection = new mysqli($serverName, $username, $password, $db);
        if (!$this -> connection) {
            die('Connection failed: ' . $this -> connection -> connect_error);
        }
    }

    public function __destruct() {
        $this -> connection -> close();
    }

    public function selectOne($columnSelection = false, $tableName, $conditions = false, $orderBy = false) {
        $response = $this -> select($columnSelection, $tableName, $conditions, $orderBy);

        return $response ? $response[0] : [];
    }
    public function select($columnSelection = false, $tableName, $conditions = false, $orderBy = false) {
        $results = [];
        $columnSelection = is_array($columnSelection) ? implode(',', $columnSelection) : (empty($columnSelection) ? '*' : $columnSelection);
        $conditionsStatement = [];
        if (is_array($conditions)) {
            foreach ($conditions as $key => $value) {
                $conditionsStatement[] = "{$key} = '{$value}'";
            }
        }
        $conditions = empty($conditionsStatement) ? '' : 'WHERE ' . implode(' AND ', $conditionsStatement);
        $orderBy = $orderBy ? "ORDER BY {$orderBy}" : '';

        $query = "SELECT {$columnSelection} FROM `{$tableName}` {$conditions} {$orderBy}";
        $stmt = $this -> connection -> prepare($query);

        if ($stmt) {
            $stmt->execute();
            $stmt->store_result();

            $meta = $stmt->result_metadata();
            while ($field = $meta->fetch_field()) {
                $variables[] = &$data[$field->name];
            }

            call_user_func_array([$stmt, 'bind_result'], $variables);

            $i = 0;
            while ($stmt->fetch()) {
                $results[$i] = [];
                foreach ($data as $k => $v) {
                    $results[$i][$k] = $v;
                }
                $i++;
            }
        }

        return $results;
    }

    public function insert($tableName, $insertData) {
        $insertID = false;
        if (is_array($insertData)) {
            foreach ($insertData as $key => $value) {
                $insertData[$key] = $this -> connection -> real_escape_string($value);
            }
            $stmt = $this -> connection -> prepare("INSERT INTO `{$tableName}` (" . implode(',', array_keys($insertData)) . ") VALUES ('" . implode("','", $insertData) . "')");
            if ($stmt->execute()) {
                $insertID = $stmt->insert_id;
            }
        }

        return $insertID;
    }

    public function delete($tableName, $conditions) {
        $conditionsStatement = [];
        if (is_array($conditions)) {
            foreach ($conditions as $key => $value) {
                $conditionsStatement[] = "{$key} = '{$value}'";
            }
        }
        $conditions = empty($conditionsStatement) ? '' : 'WHERE ' . implode(' AND ', $conditionsStatement);

        $stmt = $this -> connection -> prepare("DELETE FROM `{$tableName}` {$conditions}");
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update($tableName, $updateData, $conditions) {
        $updated = false;
        if (is_array($updateData)) {
            $updateDataStatement = [];
            if (is_array($updateData)) {
                foreach ($updateData as $key => $value) {
                    $updateDataStatement[] = "{$key} = '" . $this -> connection -> real_escape_string($value) . "'";
                }
            }
            $updateData = empty($updateDataStatement) ? '' : 'SET ' . implode(', ', $updateDataStatement);

            $conditionsStatement = [];
            if (is_array($conditions)) {
                foreach ($conditions as $key => $value) {
                    $conditionsStatement[] = "{$key} = '{$value}'";
                }
            }
            $conditions = empty($conditionsStatement) ? '' : 'WHERE ' . implode(' AND ', $conditionsStatement);

            $stmt = $this -> connection -> prepare("UPDATE `{$tableName}` {$updateData} {$conditions}");

            if ($stmt->execute()) {
                $updated = true;
            }
        }

        return $updated;
    }
}

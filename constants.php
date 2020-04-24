<?php

// define('ENVIROMENT', "PROD");
define('ENVIROMENT', 'DEV');
define('STORAGE_FOLDER_PATH', 'uploads');
define('REMOVE_BG_API_KEY', 'Q9mTBCgigfpr2s1ygG8yVgZt');

if (ENVIROMENT == 'DEV') {
    define('PROJECT_URL', 'localhost/lazysuzy/');
    define('DB_SERVER_URL', 'localhost');
    define('DB_SERVER_USERNAME', 'root');
    define('DB_SERVER_PASSWORD', '');
    define('DB_SERVER_DATABASE', 'lazysuzy');
} elseif (ENVIROMENT == 'PROD') {
    define('PROJECT_URL', 'http://four-nodes.com/projects/lazysuzy/');
    define('DB_SERVER_URL', 'localhost');
    define('DB_SERVER_USERNAME', 'root');
    define('DB_SERVER_PASSWORD', '');
    define('DB_SERVER_DATABASE', 'lazysuzy');
}

<?php
namespace myapp\model\db\connecter;

use myapp\model\db\conf\conf;

use PDO;
use PDOStatement;
use PDOException;

/**
 * Class connecter
 * @package myapp\model\db\connecter
 */
class connecter
{
    private $_pdo;

    /**
     * connecter constructor.
     * @param array $option
     */
    public function __construct(array $option = array())
    {
        try {
            $conf = new conf();
            $this->_pdo = new PDO($conf->default['DSN'], $conf->default['USER'], $conf->default['PASSWORD'], $option);
        } catch (PDOException $e) {
            throw new PDOException('query error: ' . $e->getMessage());
        }
    }

    /**
     * @param string|null $query
     * @param array $params
     * @return bool|false|PDOStatement
     */
    public function execute(string $query = null, array $params = array())
    {
        return $this->query($query, $params);
    }

    /**
     * @param string|null $query
     * @param array $params
     * @return bool|false|PDOStatement
     */
    public function query(string $query = null, array $params = array())
    {
        try {
            if(empty($query)){
                return FALSE;
            }
            
            if($params) {
                $stm = $this->_pdo->prepare($query);
                $this->_setBindValue($stm, $params);
                $ret = $stm->execute();
                if ($ret === FALSE){
                    return FALSE;
                }
                return $stm;
            } else {
                return $this->_pdo->query($query);
            }
        } catch (PDOException $e) {
            throw new PDOException('query error: ' . $e->getMessage());
            return FALSE;
        }
    }

    /**
     * @param $stm
     * @param array $params
     */
    private function _setBindValue($stm, $params = array())
    {
        if(!is_array($params)){
            return;
        }
        
        foreach ($params as $key => $val) {
            if(is_int($key)){
                $bind = $key + 1;
                $stm->bindValue($bind, $val);
            } else {
                $stm->bindValue($key, $val);
            }
        }
    }

    /**
     * @param $stm
     * @return array
     */
    public function fetchAll($stm) : array
    {
        $ret = array();
        if ($stm === FALSE) {
            return $ret;
        }
        while ($row = $stm->fetch(PDO::FETCH_ASSOC)) {
            $ret[] = $row;
        }
        return $ret;
    }

    /**
     * @param $stmt
     * @param array $columns
     * @return array
     */
    public function listAll($stmt, array $columns = array()) : array
    {
        $ret = array();
        if ($stmt === FALSE){
            return $ret;
        }
        if(count($columns) <= 0){
            return $ret;
        }
        
        if(count($columns) >= 2){
            $keyField = $columns[0];
            $valField = $columns[1];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $ret[$row[$keyField]] = $row[$valField];
            }
        } else {
            $valField = $columns[0];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $ret[] = $row[$valField];
            }
        }
        return $ret;
    }

    /**
     * @param $stm
     * @return int
     */
    public function fetchCount($stm) : int
    {
        if ($stm === FALSE) {
            return 0;
        }
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        return count($row);
    }

    /**
     * @return string
     */
    public function insertId() : string
    {
        return $this->_pdo->lastInsertId();
    }

    /**
     * @return bool
     */
    public function begin() : bool
    {
        return $this->_pdo->beginTransaction();
    }

    /**
     * @return bool
     */
    public function commit() : bool
    {
        return $this->_pdo->commit();
    }

    /**
     * @return bool
     */
    public function rollback() : bool
    {
        return $this->_pdo->rollBack();
    }

    /**
     *
     */
    public function __destruct() {
        unset($this->_pdo);
    }
}
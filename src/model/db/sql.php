<?php
namespace db\sql;

/**
 * Class sql
 * @package myapp\model\db\sql
 */
class sql
{
    /**
     * @param string $table
     * @param array $columns
     * @param array $where
     * @param array $join
     * @param array $option
     * @return string
     */
    public function createSelect(string $table, array $columns = array(), array $where = array(), array $join = array() , array $option = array()) : string
    {
        if(empty($table)){
            return "";
        }
        return "SELECT ".$this->_createColumn($columns)." FROM ".$table.$this->_createJoin($join).$this->_createWhere($where).$this->_createOption();
    }

    /**
     * @param array $columns
     * @return string
     */
    private function _createColumn(array $columns = array()) : string
    {
        if(count($columns) <= 0) {
            return "*";
        }
        return implode(",", $columns);
    }

    /**
     * @param array $join
     * @return string
     */
    private function _createJoin(array $join = array()) : string
    {
        if (count($join) <= 0) {
            return "";
        }
        
        $j = "";
        foreach ($join as $val) {
            $j += " ".$val;
        }

        return $j;
    }

    /**
     * @param array $where
     * @return string
     */
    private function _createWhere(array $where = array()) : string
    {
        $w = array();
        if(count($where) <= 0) {
            return "";
        }
        
        if(isset($where["WHERE"])) {
            foreach ($where["WHERE"] as $val){
                $w[] = $val." ? ";
            }
            return " WHERE ".implode(" AND ", $w);
        }
        
        foreach ($where as $key => $val) {
            if(is_int($key)){
                $w[] = $val." ? ";
            } else {
                $w[] = $val.$key;
            }
        }
        
        return " WHERE ".implode(" AND ", $w);
    }

    /**
     * @param array $option
     * @return string
     */
    private function _createOption(array $option = array())
    {
        $o = "";
        if(count($option) <= 0) {
            return $o;
        }
        
        foreach ($option as $val) {
            $o += " ".$val;
        }
        return $o;
    }

    /**
     * @param string $table
     * @param array $where
     * @return string
     */
    public function createInsert(string $table, array $where = array()) : string
    {
        if(empty($table) || count($where) <= 0) {
            return "";
        }
        return "INSERT INTO ".$table.$this->_createInsertPram($where);
    }

    /**
     * @param array $where
     * @return string
     */
    private function _createInsertPram($where = array()) : string
    {
        $w = array();
        $p = array();
        foreach ($where as $key => $val) {
            if(is_int($key)){
                $w[] = $val;
                $p[] = " ? ";
            } else {
                $w[] = $val;
                $p[] = $key;
            }
        }
        
        return " (".implode(",", $w).") VALUES (".implode(",", $p).")";
    }

    /**
     * @param string $table
     * @param array $value
     * @param array $where
     * @return string
     */
    public function createUpdate(string $table, array $value = array(), array $where = array()) : string
    {
        if(empty($table) || count($value) <= 0 ||count($where) <= 0) {
            return "";
        }
        return "UPDATE ".$table." SET ".$this->_createValue($value).$this->_createWhere($where);
    }

    /**
     * @param array $value
     * @return string
     */
    private function _createValue(array $value = array()) : string
    {
        $w = array();
        if(count($value) <= 0) {
            return "";
        }
        foreach ($value as $key => $val) {
            if(is_int($key)){
                $w[] = $val." = ? ";
            } else {
                $w[] = $key." = ".$val;
            }
        }
        return implode(" , ", $w);
    }
    
    
    /**
     *
     * @param string $table
     * @param array $where
     * @return string
     */
    public function createDelete(string $table, array $where = array()) : string
    {
        if(empty($table)) {
            return "";
        }
        return "DELETE FROM ".$table.$this->_createWhere($where);
    }

}
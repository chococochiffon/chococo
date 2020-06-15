<?php
namespace myapp\model\db\datasource;

use myapp\model\db\connecter\connecter;
use myapp\model\db\sql\sql;
use PDOStatement;

/**
 * Class datasource
 * @package myapp\model\db\datasource
 */
class datasource extends connecter {

    private $_table;

    private $_column;

    private $_where;

    private $_param;

    private $_join;

    private $_option;

    private $_createSql;

    private $_values;

    /**
     * datasource constructor.
     * @param array $option
     */
    public function __construct(array $option = array())
    {
        $this->_createSql = new sql();
        parent::__construct($option);
    }

    /**
     * @param string $table
     * @return string
     */
    public function setTable(string $table) : string
    {
        $this->_table = $table;
    }

    /**
     * @return false|string
     */
    private function _getTable()
    {
        if (is_null($this->_table))
        {
            return get_called_class();
        } else {
            return $this->_table;
        }
    }

    /**
     * @return array
     */
    protected function getAll() : array
    {
        return $this->select(
            $this->_getColumn(),
            $this->_getWhere(),
            $this->_getParams(),
            $this->_getJoin(),
            $this->_getOption()
        );
    }

    /**
     * @return array
     */
    protected function getList()
    {
        return $this->list(
            $this->_getColumn(),
            $this->_getWhere(),
            $this->_getParams(),
            $this->_getJoin(),
            $this->_getOption()
        );
    }

    /**
     * @return number
     */
    protected function getCount()
    {
        return $this->selectCount(
            $this->_getWhere(),
            $this->_getParams(),
            $this->_getJoin(),
            $this->_getOption()
        );
    }

    /**
     * @param array $where
     * @param array $params
     * @param array $value
     * @return bool|PDOStatement|string
     */
    protected function save(array $where = array(), array $params = array(), array $value = array())
    {
        if(count($value) <= 0){
            return $this->insert($this->_getWhere(), $this->_getParams());
        } else {
            return $this->update($this->_getWhere(), $this->_getParams(), $value);
        }
    }

    /**
     * @param array $columns
     */
    private function _setColumn(array $columns = array())
    {
        $this->_column = $columns;
    }

    /**
     * @return array
     */
    private function _getColumn() : array
    {
        return $this->_column;
    }

    /**
     * @param array $columns
     * @return $this
     */
    protected function column(array $columns = array()) : datasource
    {
        $this->_setColumn($columns);
        return $this;
    }

    /**
     * @param array $where
     */
    private function _setWhere(array $where = array())
    {
        $this->_where = $where;
    }

    /**
     * @return array
     */
    private function _getWhere() : array
    {
        return $this->_where;
    }

    /**
     * @param array $params
     */
    private function _setParams(array $params = array())
    {
        $this->_param = $params;
    }

    /**
     * @return array
     */
    private function _getParams() : array
    {
        return $this->_param;
    }

    /**
     * @param array $where
     * @param array $params
     * @return $this
     */
    protected function where(array $where = array(), array $params = array())  : datasource
    {
        $this->_setWhere($where);
        $this->_setParams($params);
        return $this;
    }

    /**
     * @param array $join
     */
    private function _setJoin(array $join = array())
    {
        $this->_join = $join;
    }

    /**
     * @return array
     */
    private function _getJoin() : array
    {
        return $this->_join;
    }

    /**
     * @param array $join
     * @return $this
     */
    protected function join(array $join = array()) : datasource
    {
        $this->_setJoin($join);
        return $this;
    }

    /**
     * @param array $option
     */
    private function _setOption(array $option = array())
    {
        $this->_option = $option;
    }

    /**
     * @return array
     */
    private function _getOption() : array
    {
        return $this->_option;
    }

    /**
     * @param array $option
     * @return $this
     */
    protected function option(array $option = array()) : datasource
    {
        $this->_setOption($option);
        return $this;
    }

    /**
     * @param array $values
     */
    private function _setValue(array $values = array())
    {
        $this->_values = $values;
    }

    /**
     * @return array
     */
    private function _getValue() : array
    {
        return $this->_values;
    }

    /**
     * @param array $value
     * @return $this
     */
    protected function value(array $value = array()) : datasource
    {
        $this->_setValue($value);
        return $this;
    }

    /**
     * @param array $columns
     * @param array $where
     * @param array $params
     * @param array $join
     * @param array $option
     * @return array
     */
    public function select(array $columns = array(), array $where = array(), array $params = array(), array $join = array() , array $option = array()) : array
    {
        return $this->fetchAll($this->execute($this->_createSql->createSelect($this->_getTable(), $columns, $where, $join, $option), $params));
    }

    /**
     * @param array $columns
     * @param array $where
     * @param array $params
     * @param array $join
     * @param array $option
     * @return array
     */
    public function list(array $columns = array(), array $where = array(), array $params = array(), array $join = array() , array $option = array()) : array
    {
        return $this->listAll($this->execute($this->_createSql->createSelect($this->_getTable(), $columns, $where, $join, $option), $params), $columns);
    }

    /**
     * @param array $where
     * @param array $params
     * @param array $join
     * @param array $option
     * @return int
     */
    public function selectCount(array $where = array(), array $params = array(), array $join = array() , array $option = array()) : int
    {
        $columns = array("count(*) as count");
        return $this->fetchCount($this->execute($this->_createSql->createSelect($this->_getTable(), $columns, $where, $join, $option), $params));
    }

    /**
     * @param array $where
     * @param array $params
     * @return bool|string
     */
    public function insert(array $where = array(), array $params = array())
    {
        $ret = $this->execute($this->_createSql->createInsert($this->_getTable(), $where), $params);
        if ($ret === FALSE){
            return FALSE;
        }
        return $this->insertId();
    }

    /**
     * @param array $where
     * @param array $params
     * @param array $value
     * @return bool|false|PDOStatement
     */
    public function update(array $where = array(), array $params = array(), array $value = array())
    {
        return $this->execute($this->_createSql->createUpdate($this->_getTable(), $value, $where), $params);
    }

    /**
     * @param array $where
     * @param array $params
     * @return bool|false|PDOStatement
     */
    public function delete(array $where = array(), array $params = array())
    {
        return $this->execute($this->_createSql->createDelete($this->_getTable(), $where), $params);
    }
}
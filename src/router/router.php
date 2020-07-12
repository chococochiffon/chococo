<?php
namespace myapp\router;

/**
 * Class router
 * @package myapp\router
 */
class router
{
    private $_fileNameArray;
    
    private $_actionName;
    
    private $_cnt;
    
    private $_className;
    
    private $_controllerPath;

    /**
     * @param string $fileName
     */
    public function load(string $fileName)
    {
        ob_start();
        /** @noinspection PhpIncludeInspection */
        include $this->createPath($fileName);
        $output = ob_get_contents();
        ob_end_clean();

        if ($this->loadController($fileName)) {
            $this->run();
        } else {
            echo $output;
        }
    }

    /**
     * @param string $fileName
     * @return string
     */
    public function createPath(string $fileName) : string
    {
        if(empty($fileName)){
            return dirname(__FILE__) .'/../../404.html';
        }
        
        $path = dirname(__FILE__) .'/../../'.$fileName;
        
        if(!file_exists($path)){
            return dirname(__FILE__) .'/../../404.html';
        }
        return $path;
    }

    /**
     * @param string $fileName
     * @return bool
     */
    public function loadController(string $fileName) : bool
    {
        $this->_crateFileNameToArray($fileName);

        $this->_cnt = count($this->_fileNameArray);
        if ($this->_cnt > 0) {
            return $this->_createClassName()
                ->_createActionName()
                ->_createControllerPath()
                ->_checkControllerPath();
        } else {
            return false;
        }
    }

    /**
     * @param string $fileName
     */
    private function _crateFileNameToArray(string $fileName = null)
    {
        $this->_fileNameArray = empty($fileName) ? array() : explode('/', $fileName);
    }

    /**
     * @param int $cnt
     * @return string
     */
    private function _searchControllerName(int $cnt = 0) : string
    {
        if(isset($this->_fileNameArray[$cnt])){
            return $this->_fileNameArray[$cnt];
        }
        return "";
    }

    /**
     * @return $this
     */
    private function _createClassName()
    {
        $className = 'index';
        if ($this->_cnt > 1) {
            $className = $this->_searchControllerName($this->_cnt - 2);
        }
        $this->_className = $className.'Controller';

        return $this;
    }

    /**
     * @return $this
     */
    private function _createActionName()
    {
        $reg = "/(.*)(?:\.([^.]+$))/";
        $retArr = array();
        
        preg_match($reg, $this->_searchControllerName($this->_cnt - 1), $retArr);
        $this->_actionName = isset($retArr[1]) ? $retArr[1] : "";

        return $this;
    }

    /**
     * @return $this
     */
    private function _createControllerPath()
    {
        $this->_controllerPath = dirname(__FILE__).'/../controller/'.$this->_className.'.php';

        return $this;
    }

    /**
     * @return bool
     */
    private function _checkControllerPath() : bool
    {
        if (!file_exists($this->_controllerPath)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     *
     */
    public function run()
    {
        /** @noinspection PhpIncludeInspection */
        include $this->_controllerPath;

        $actionName = $this->_actionName;
        
        $controller = new $this->_className;
        $controller->$actionName();
    }
}
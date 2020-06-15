<?php
namespace myapp\router;

/**
 * Class router
 * @package myapp\router
 */
class router
{
    private $_fileNames;
    
    private $_actionName;
    
    private $_cnt;
    
    private $_className;
    
    private $_controllerPath;
    
    private $_output;

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
        
        $this->_setOutput($output);
        if($this->loadController($fileName)) {
            
            $this->run();
        } else {
            echo $this->_getOutput();
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
        $this->_setFileNames($fileName);
        
        $this->_setCnt($this->_getFileNames());
        
        if ($this->_getCnt() > 0) {
            $this->_createClassName();
            
            $this->_createActionName();
            
            $this->_createControllerPath();
            
            return $this->_checkControllerPath();
        } else {
            return false;
        }
    }

    /**
     * @param string $fileName
     */
    private function _setFileNames(string $fileName)
    {
        $this->_fileNames = empty($fileName) ? array() : explode('/', $fileName);
    }

    /**
     * @return string
     */
    private function _getFileNames() : string
    {
        return $this->_fileNames;
    }

    /**
     * @param int $cnt
     * @return string
     */
    private function _searchFileName(int $cnt = 0) : string
    {
        if(isset($this->_fileNames[$cnt])){
            return $this->_fileNames[$cnt];
        }
        return "";
    }

    /**
     * @param array $actions
     */
    private function _setCnt(array $actions = array())
    {
        $this->_cnt = count($actions);
    }

    /**
     * @return int
     */
    private function _getCnt() : int
    {
        return $this->_cnt;
    }

    /**
     *
     */
    private function _createClassName()
    {
        $path = 'index';
        if ($this->_getCnt() > 1) {
            $path = $this->_searchFileName($this->_getCnt() - 2);
        }
        $this->_setClassName($path.'Controller');
    }

    /**
     * @param string $className
     */
    private function _setClassName(string $className)
    {
        $this->_className = $className;
    }

    /**
     * @return string
     */
    private function _getClassName() : string
    {
        return $this->_className;
    }

    /**
     *
     */
    private function _createActionName()
    {
        $reg = "/(.*)(?:\.([^.]+$))/";
        $retArr = array();
        
        preg_match($reg, $this->_searchFileName($this->_getCnt() - 1), $retArr);
        $action = isset($retArr[1]) ? $retArr[1] : "";
        
        $this->_setActionName($action);
    }

    /**
     * @param string $action
     */
    private function _setActionName(string $action)
    {
        $this->_actionName = $action;
    }

    /**
     * @return string
     */
    private function _getActionName() : string
    {
        return $this->_actionName;
    }

    /**
     *
     */
    private function _createControllerPath()
    {
        $this->_setControllerPath(dirname(__FILE__).'/../controller/'.$this->_getClassName().'.php');
    }

    /**
     * @param string $controllerPath
     */
    private function _setControllerPath(string $controllerPath)
    {
        $this->_controllerPath = $controllerPath;
    }

    /**
     * @return string
     */
    private function _getControllerPath() : string
    {
        return $this->_controllerPath;
    }

    /**
     * @return bool
     */
    private function _checkControllerPath() : bool
    {
        if(!file_exists($this->_getControllerPath())){
            return false;
        } else {
            return true;
        }
    }

    /**
     * @param string $output
     */
    private function _setOutput(string $output = "")
    {
        $this->_output = $output;
    }

    /**
     * @return string
     */
    private function _getOutput() : string
    {
        return $this->_output;
    }

    /**
     *
     */
    public function run() {
        include dirname(__FILE__).'/../controller/logic/appController.php';
        /** @noinspection PhpIncludeInspection */
        include $this->_getControllerPath();
        
        $className = $this->_getClassName();
        $actionName = $this->_getActionName();
        
        $controller = new $className;
        $controller->$actionName();
//         echo "test1";
//         if (method_exists($controller, $actionName)) {
//             $controller->$actionName();
//             echo "test2";
//             $controller->request()->setPost($_POST);
//             $controller->request()->setGet($_GET);
//             $controller->request()->setRequest($_REQUEST);
//         } else {
//             echo $this->_getOutput();
//         }
        
    }
}
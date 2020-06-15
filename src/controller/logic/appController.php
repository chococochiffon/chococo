<?php
use myapp\controller\logic\request\request;
include dirname(__FILE__).'/request.php';

class appController {
    
    private $_r;
    
    private $_h;
    
    public function __construct() {
        $this->_callRequest();
        //$html = new html();
    }
    
    private function _setRequest($request) {
        $this->_r = $request;
    }
    
    private function _getRequest() {
        return $this->_r;
    }
    
    public function request(){
        return $this->_getRequest();
    }
    
    private function _callRequest() {
        new request();
    }
}
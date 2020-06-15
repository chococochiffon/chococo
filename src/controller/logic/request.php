<?php
namespace myapp\controller\logic\request;

class request {
    
    private $_p = array();
    
    private $_g = array();
    
    private $_r = array();
    
    
    /**
     * 
     * @param array $parem
     */
    public function setPost(array $parem = array()) {
        $this->_p = $parem;
    }
    
    /**
     * 
     * @return array
     */
    private function getPost() {
        return $this->_p;
    }
    
    /**
     * 
     * @return array
     */
    public function post() {
        return $this->getPost();
    }
    
    /**
     *
     * @param array $parem
     */
    public function setGet(array $parem = array()) {
        $this->_g = $parem;
    }
    
    /**
     *
     * @return array
     */
    private function getGet() {
        return $this->_g;
    }
    
    /**
     *
     * @return array
     */
    public function get() {
        return $this->getGet();
    }
    
    /**
     * 
     * @param array $parem
     */
    public function setRequest(array $parem = array()) {
        $this->_r = $parem;
    }
    
    /**
     *
     * @return array
     */
    public function getRequest() {
        return $this->_r;
    }
}
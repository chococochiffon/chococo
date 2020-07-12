<?php 
namespace view\html;

/**
 * Class html
 * @package myapp\view
 */
class html
{
    /**
     * html constructor.
     */
    public function __construct()
    {
    }

    /**
     * @param string|null $fileName
     * @return string
     */
    public function createPath(string $fileName = null) : string
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
     * @param string $stHtml
     * @return string|string[]|null
     */
    public function replaceHtml(string $stHtml)
    {
        $stHtml = preg_replace_callback('/<!---(.+?)--->/', array($this, '_replaceTag'), $stHtml); 
        
        return $stHtml;
    }

    /**
     * @param array $matches
     * @return string
     */
    private function _replaceTag(array $matches = array()) : string
    {
        $item = trim($matches[1]);

        $item = explode(" ", $item);
        
        return '<'.$item.'/>';
    }
}
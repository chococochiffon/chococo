<?php
namespace logic\controller;

use logic\request\request;
use view\html\html;

/**
 * Class appController
 * @package logic\controller
 */
class appController
{
    private $request;

    private $html;

    /**
     * appController constructor.
     */
    public function __construct() {
        $this->request = new request();
        $this->html = new html();
    }



    /**
     * @param $name
     * @return mixed
     */
    public function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->{$name};
    }

    /**
     * @param $name
     * @param $value
     */
    public function __set($name, $value)
    {
        // TODO: Implement __set() method.
        $this->{$name} = $value;
    }
}
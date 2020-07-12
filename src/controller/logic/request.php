<?php
namespace logic\request;

/**
 * Class request
 * @package logic\request
 */
class request
{
    
    public $post;

    public $get;

    /**
     * request constructor.
     */
    public function __construct()
    {
        $this->post = (object)$_POST;

        $this->get = (object)$_GET;
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
<?php
use logic\controller\appController;

class indexController extends appController
{
    
    public function index(){
        
        echo dirname(__FILE__);
        var_dump($_GET);
        var_dump($_POST);
    }
}
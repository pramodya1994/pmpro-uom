<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //
    protected $table = 'category';
    protected $primaryKey = 'category_id';
    public $timestamps = false;
    public function privileges()
    {
        return $this-> belongsToMany('App\Privilege','category_has_functions','category_id','fid');

    }
}

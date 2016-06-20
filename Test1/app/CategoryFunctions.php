<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CategoryFunctions extends Model
{
    protected $table = 'category_has_functions';
    protected $primaryKey = 'chfid';
    public $timestamps = false;
}

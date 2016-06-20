<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Extend extends Model
{
    //
    protected $table = 'extend';
    protected $primaryKey = 'extid';
    public $timestamps = false;
}

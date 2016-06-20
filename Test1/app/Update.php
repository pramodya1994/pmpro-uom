<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Update extends Model
{
    //
    protected $table = 'update';
    protected $primaryKey = 'uid';
    public $timestamps = false;
}

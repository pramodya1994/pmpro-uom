<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubTask extends Model
{
    //
    protected $table = 'subtask';
    protected $primaryKey = 'stid';
    public $timestamps = false;

}

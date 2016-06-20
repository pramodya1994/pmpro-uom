<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorksOn extends Model
{
    //
    protected $table = 'works_on';
    protected $primaryKey = 'woid';
    public $timestamps = false;
}

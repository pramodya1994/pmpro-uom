<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AssignedTo extends Model
{
    //
    protected $table = 'assigned_to';
    protected $primaryKey = 'aid';
    public $timestamps = false;
}

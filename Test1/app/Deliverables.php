<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deliverables extends Model
{
    //
    protected $table = 'deliverables';
    protected $primaryKey = 'del_id';
    public $timestamps = false;
}

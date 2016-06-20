<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Func extends Model
{
    protected $table = 'functions';
    protected $primaryKey = 'fid';
    public $timestamps = false;
}

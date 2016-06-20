<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MemberDetail extends Model
{
    protected $table = 'member_details';
    protected $primaryKey = 'member_details_id';
    public $timestamps = false;
}

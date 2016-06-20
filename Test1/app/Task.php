<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'task';
    protected $primaryKey = 'tid';
    public $timestamps = false;

    public function hasSubtask(){
        return $this->hasMany('App\Subtask','task_tid','tid');
    }
}

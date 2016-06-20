<?php

namespace App\Http\Controllers;

use App\Extend;
use App\Subtask;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    public  function approve(Request $request)
    {
        $sid = $request->input('taskid');
        Subtask::where('stid',$sid)->update(['status'=>1]);
    }

    public  function cancel(Request $request)
    {
        $sid = $request->input('taskid');
        Subtask::where('stid',$sid)->update(['status'=>0]);
    }




    public  function approveExt(Request $request)
    {
        $sid = $request->input('taskid');
        Extend::where('extid',$sid)->update(['status'=>1]);
    }

    public function cancelExtended(Request $request)
    {
        $id = $request->input('taskid');
        Extend::where('extid',$id)->update(['status'=>0]);

    }
}

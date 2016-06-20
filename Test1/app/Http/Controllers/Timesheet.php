<?php

namespace App\Http\Controllers;

use App\Category;
use Illuminate\Http\Request;
use App\Task;
use App\Update;
use App\Project;
use App\member;
use App\Http\Requests;
use App\Extend;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class Timesheet extends Controller
{
    public function projectCost(Request $request)
    {
        $company_id = Session::get('company_id');
        $name = $request->input('name');
        $T = array();
        $task_details = array();
        $task_cost = 0;
        $current_cost = 0;
        $project = Project::where([['pname', $name],['company_id',$company_id]])->value('pid');

        $initial_cost = Project::where([['pname', $name],['company_id',$company_id]])->value('initial_cost');
       // Role::where([['cname',$catName],['company_id',$companyID]])-
        $tasks = Task::where('project_pid',$project)->get();

        foreach($tasks as $t)
        {
            $sub= Task::find($t->tid)->hasSubtask;
            $timeSpent = 0;
            foreach($sub as $s)
            {
                $sub_state = $s->status;
                if($sub_state == 0)
                    $su= "Ongoing";
                else if($sub_state == 1)
                    $su = "Complete";
                else if($sub_state == 2)
                    $su = "Submitted";
                else if($sub_state == 3)
                {
                    $es = Extend::where('subtask_id',$s->stid)->value('status');
                    if($es == "0")
                    {
                        $su = "Extended-Ongoing";
                    }
                    if($es == "1")
                    {
                        $su = "Extended-Completed";
                    }


                }
                else if($sub_state == 4)
                    $su = "Overdue";
                $id = $s->mem_id;
                $member = member::where('member_id', $id)->value('category_id');
                $rate = Category::where('category_id', $member)->value('rate');
                $subT = Update::where('subtask_stid', $s->stid)->get();
                foreach($subT as $sb)
                {
                    $hour = $sb->actual_time;
                    $timeSpent = $timeSpent + $hour;
                    $task_cost = $task_cost + ($rate * $hour);
                }
            }
            $current_cost = $current_cost + $task_cost;
            $task = array('name'=>"$t->tname",'time_asigned'=>"$t->total_estimated_time",'time_spent'=>"$timeSpent",
                           'cost'=>"$task_cost",'status'=>"$su");
            array_push($task_details,$task);

        }
       // $cost = array('initial_cost'=>"$initial_cost",'current_cost'=>"$current_cost");
        $T['initial_cost']=$initial_cost;
        $T['current_cost']=$current_cost;
        $T['tasks']=$task_details;
        //array_push($T,$cost);
        return $T;

    }
}

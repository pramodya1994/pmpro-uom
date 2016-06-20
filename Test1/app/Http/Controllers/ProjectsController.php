<?php

namespace App\Http\Controllers;

use App\Category;
use App\Extend;
use App\WorksOn;
use Carbon\Carbon;
use App\Deliverables;
use App\Task;
use App\Subtask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
//use Illuminate\Support\Facades\Session;
use App\Project;
use App\Member;
use App\MemberDetail;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class ProjectsController extends Controller
{
    public function getProjectDetails(Request $request)
    {

        $name = $request->input('name');

        $companyId = Session::get('company_id');

        $project = Project::where([['pname',$name],['company_id',$companyId]])->first();

        $client_id = $project->client_mid;

        $clientname = MemberDetail::where('member_id',$client_id)->value('name');

        $pid = $project->pid;

        //  Session::put('project_id', $pid);
        $P = array('ProjectDetails'=>$project,'clientName'=>"$clientname");
        return ($P);


    }

    /////////////////////////////////////////////////////////////////////
    ///function to get members n deliverables of ongoing projects to edit

    public  function getMembersnDeliverables(Request $request){
        $name = $request->input('name');

        $companyId = Session::get('company_id');
        $project = Project::where([['pname',$name],['company_id',$companyId]])->first();
        $taskAssignorID = $project->techlead_mid;
        $taskAssignor = MemberDetail::where('member_id',$taskAssignorID)->value('name');
        $catid = Member::where('member_id',$taskAssignorID)->value('category_id');
        $taskAssignorCat = Category::where('category_id',$catid)->value('cname');
        $wrkinMems = WorksOn::where('project_pid',$project->pid)->get();

        $i = 0;
        $M = array();

        foreach($wrkinMems as $w)
        {
            $name = MemberDetail::where('member_id',$w->member_mid)->value('name');
            $cat = Member::where('member_id',$w->member_mid)->value('category_id');

            $catName = Category::where('category_id',$cat)->value('cname');

            $M[$i]["name"]= $name;
            $M[$i]["category"]= $catName;
            $i++;
        }

        $deliverables = Deliverables::where('pid',$project->pid)->get();
        $PDetails=array('WorkingMembers'=>$M,'Deliverables'=>$deliverables,'Pdeadline'=>$project->end_date,
            'Pid'=>$project->pid,'TaskAssignor'=>$taskAssignor,'TaskAssignCat'=> $taskAssignorCat);
        return ($PDetails);





    }


    public function getInitiatedProjects(Request $request)
    {
        //$id = $request->session()->get('functions');
        $memid = Session::get('member_id');
        $compid = Session::get('company_id');
        //return($id);
        $projects = Project::where([['project_manager_mid', $memid],['status',0],['company_id',$compid]])->get();

        foreach ($projects as $projectname) {
            $p[] = $projectname->pname;
        }
        $names = implode(", ", $p);
        return ($names);

    }

    public function addMembersDeliverables(Request $request)
    {

        $MemsnDels = $request->input('ProjectData');
        $id = $MemsnDels["pid"];
        $taskAssignee = $MemsnDels["TaskAssignee"];
        $members = $MemsnDels["mems"];
        $deliverables = $MemsnDels["dels"];

        $cid = Session::get('company_id');


        foreach($deliverables as $d)
        {

            $deliverable =  new Deliverables();
            $deliverable->del_name = $d["name"];
            $deliverable->deadline = $d["deadline"];
            $deliverable->pid = $id;
            $deliverable->save();

        }

        foreach($members as $m)
        {

            $name = $m["name"];
            $memids = MemberDetail::where('name',$name)->select('member_id')->get();

            foreach($memids as $mi)
            {
                $compid=Member::where('member_id',$mi->member_id)->value('company_id');

                if($compid == $cid )
                {
                    $memberid = $mi->member_id;
                    //$work->member_mid = $memberid;
                    break;
                }
            }
            $work = new WorksOn;
            $work->project_pid = $id;
            $work->member_mid = $memberid;
            $work->special_rate = 0;
            $work->save();

        }

        $memids = MemberDetail::where('name',$taskAssignee)->select('member_id')->get();
        foreach($memids as $m)
        {
            $compid = Member::where('member_id', $m->member_id)->value('company_id');
            if ($compid == $cid)
            {
                $memberid = $m->member_id;
                Project::where('pid',$id)->update(['techlead_mid'=>$memberid,'status'=>1]);

                break;
            }

        }


        return 'ok';
    }





    public function getProjectToEdit(Request $request){
        $memid = Session::get('member_id');
        $compid = Session::get('company_id');
        //return($id);
        $projects = Project::where([['project_manager_mid', $memid],['company_id',$compid]])->get();
        foreach ($projects as $PN) {
            if($PN->status == 1 ) {

                $p[] = $PN->pname;

            }
        }
        $names = implode(", ", $p);
        return ($names);

    }

    public function updateDeliverable(Request $request)
    {
        $pid = $request->input('Pid');
        $did= $request->input('Delid');
        $name = $request->input('deliverable');
        $deadline = $request->input('deadline');
        $d = Deliverables::where([['del_name',$name],['pid',$pid]])->exists();
         if($d){
             return("0");
         }

        Deliverables::where([['del_id',$did],['pid',$pid]])->update(['del_name'=>$name,'deadline'=>$deadline]);
         return("1");
    }

    public  function getProjectsToViewTimesheetandTasks(Request $request){
        $memid = Session::get('member_id');
        $compid = Session::get('company_id');
        //return($id);
        $projects = Project::where([['project_manager_mid', $memid],['company_id',$compid]])->get();
        foreach ($projects as $PN) {
            if($PN->status == 2 ) {

                $p[] = $PN->pname;

            }
        }
        $names = implode(", ", $p);
        return ($names);
    }




    public function addDeliverable(Request $request)
    {
        $del = $request->input('deliverable');
        $pid = $request->input('PID');
        $deadline =  $request->input('deadline');
        $d = Deliverables::where([['del_name',$del],['pid',$pid]])->exists();
        //$pid = Project::where('pname',$project)->value('pid');

          /* $name =  $d['deliverable']['name'];
           $deadline = $d['deliverable']['deadline'];*/
        if($d)
        {
            return(0);
        }
           $deliverable =  new Deliverables();
           $deliverable->del_name = $del;
           $deliverable->deadline = $deadline;
           $deliverable->pid = $pid;
           $deliverable->save();
         return(1);

    }

    public function deleteDel(Request $request){
        $d = $request->input('deliverable');
        $pid = $request->input('pid');


        $del = Deliverables::where([['pid',$pid],['del_name',$d]]);

        $del ->delete();
        return("k");
    }

    public function getOngoing(Request $request)
    {
        $T =array();
        $Ex = array();
        $name = $request->input('name');
        $compId = Session::get('company_id');
        $project = Project::where([['pname', $name],['company_id',$compId]])->first();

        $pid = $project->pid;
        $cid = $project->client_mid;
        $client_name = MemberDetail::where('member_id',$cid)->value('name');
        $deliverables = Deliverables::where('pid',$pid)->get();
        $tasks = Task::where('project_pid',$pid)->get();

        foreach($tasks as $t){
            $S = array();
            $sub= Task::find($t->tid)->hasSubtask;
            $status = $t->status;

            if($status == 0)
                $ts= "Ongoing";
            else if($status == 1)
                $ts = "Complete";
            //  else if($status == 2)
            //  $ts = "Extended";
            foreach($sub as $s)
            {
                $sub_state = $s->status;
                if($sub_state == 0)
                    $su= "Ongoing";
                else if($sub_state == 1)
                    $su = "Completed";
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
                $member = MemberDetail::where('member_id',$id)->value('name');
                $subtasks = array('task_id' => "$s->task_tid",'name' => "$s->stname","status"=>$su,
                    'deadline' => "$s->deadline", 'member' => $member, 'time' => "$s->estimated_time");
                //return $subtasks;
                array_push($S,$subtasks);
            }
            //return $S;
            $task = array('tid'=>"$t->tid",'name'=>"$t->tname",'time'=>"$t->total_estimated_time",
                'deadline'=>"$t->deadline", 'status'=>$ts ,'subtasks'=>$S);
            array_push($T,$task);

            foreach($sub as $subE)
            {

                $Extended = Extend::where('subtask_id',$subE->stid)->exists();
                if($Extended)
                {
                    $ex = Extend::where('subtask_id',$subE->stid)->first();

                    if($ex->status == 0)
                        $extSt = "Ongoing";
                    else if($ex->status == 1)
                        $extSt = "Complete";
                    $memname = MemberDetail::where('member_id',$subE->mem_id)->value('name');
                    $ext = array('ExtendedName'=>"$subE->stname",'TaskStatus'=>"$extSt",'deadline'=>"$ex->deadline",
                        'hours'=>"$ex->granted_hrs",'DevName'=>$memname);
                    array_push($Ex,$ext);
                }
                // array_push($Ex,$ext);
            }
            // return $Ex;
        }
        // return $Ex;
        /*   foreach($sub as $subE) {
               $Extended = Extend::where('subtask_id',$subE->stid)->exists();
               if($Extended){
                   $ex = Extend::where('subtask_id',$subE->stid)->first();

                   if($ex->status == 0)
                       $extSt = "Ongoing";
                   else if($ex->status == 1)
                       $extSt = "Complete";
                   $s = array('ExtendedName'=>"$subE->stname",'TaskStatus'=>"$extSt",'dev_reason'=>"$ex->dev_reason",
                       'grant_reason'=>"$ex->tl_reason",'deadline'=>"$ex->deadline");
               }
               array_push($Ex,$s);
               }
           return $sub;*/
        $projects = array('ProjectDetails'=>$project,'Deliverables'=>$deliverables,'Tasks'=>$T,'Client'=>$client_name,
            'Extendedtasks'=>$Ex);
        return($projects);
    }


}
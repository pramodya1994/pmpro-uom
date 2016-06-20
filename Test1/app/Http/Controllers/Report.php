<?php

namespace App\Http\Controllers;


use App\Category;
use App\CategoryFunctions;
use App\deliverables;
use App\Extend;
use App\Func;
use App\MemberDetail;
use App\Task;
use App\Subtask;
use App\WorksOn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
//use Illuminate\Support\Facades\Session;
use App\Project;
use App\member;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Carbon\Carbon;


class Report extends Controller
{

     function getReportDetails(Request $request)
    {
        $T = array();
        $S = array();
        $memberProgress = array();

        $EmpC = 0;
        $EmpI = 0;
        $EmpO = 0;
        $EmpEC = 0;
        $EmpEI = 0;
        $EmpSub = 0;

        $name = $request->input('name');
        $CompId = Session::get('company_id');//get the company ID
        $project = Project::where([['pname',$name],['company_id', $CompId] ])->first();
        //$project = Project::where('pname', $name)->first();
        $pid = $project->pid;
        $members = WorksOn::where('project_pid', $pid)->Select('member_mid')->distinct()->get();
        // return $members;
        //$memberNum = $members->count();
        //return $memberNum;
        // $client_name = member::where('member_id',$cid)->value('name');
        $deliverables = Deliverables::where('pid', $pid)->get();
        //return $deliverables;
        $tasks = Task::where('project_pid', $pid)->get();
        //return $tasks;
        foreach ($members as $mem) {
            $C = 0;
            $I = 0;
            $O = 0;
            $EC = 0;
            $EI = 0;
            $Sub = 0;
            $mid = $mem->member_mid;
            $member = MemberDetail::where('member_id', $mid)->value('name');
            foreach ($tasks as $t) {
                $sub = Task::find($t->tid)->hasSubtask;
                foreach ($sub as $s) {
                    $id = $s->mem_id;
                    //return $mid;
                    if ($mid == $id) {
                        $task = array('tid' => "$t->tid", 'name' => "$t->tname", 'time' => "$t->total_estimated_time",
                            'deadline' => "$t->deadline", 'status' => "$t->status");
                        array_push($T, $task);
                        $subtasks = array('task_id' => "$s->task_tid", 'name' => "$s->stname", 'status' => "$s->status",
                            'deadline' => "$s->deadline", 'member' => "$member", 'time' => "$s->estimated_time");
                        array_push($S, $subtasks);
                        $state = $s->status;
                        $sub_id = $s->stid;
                        $deadline = $s->deadline;
                        $deadline = Carbon::parse($deadline);
                        $due = $deadline->isFuture();
                        if (!$due) {
                            if ($state == 0)
                                $I++;
                            if ($state == 1)
                                $C++;
                            if ($state == 2)
                                $Sub++;
                            if ($state == 3) {
                                $extended = Extend::where('subtask_id', $sub_id)->value('status');
                                if ($extended == 0)
                                    $EI++;
                                if ($extended == 1)
                                    $EC++;
                            }
                            if ($state == 4)
                                $O++;
                        }
                    }
                }
            }
            $details = array('EmployeeName' => $member, 'completed' => $C, 'incomplete' => $I, 'ExtComplete' => $EC,
                'ExtInComplete' => $EI, 'Overdue' => $O, 'Submitted' => $Sub);
            $EmpC = $EmpC + $C;
            $EmpI = $EmpI + $I;
            $EmpO = $EmpO + $O;
            $EmpEC = $EmpEC + $EC;
            $EmpEI = $EmpEI + $EI;
            $EmpSub = $EmpSub + $Sub;
            array_push($memberProgress, $details);
        }

        $D = array('ProjectName' => $project, 'Deliverables' => $deliverables, 'Tasks' => $T, 'Subtasks' => $S,
            'completed' => $EmpC, 'incomplete' => $EmpI, 'ExtComplete' => $EmpEC, 'ExtInComplete' => $EmpEI,
            'Overdue' => $EmpO, 'Submitted' => $EmpSub, 'Progress' => $memberProgress);
        return $D;
        // $TZ='Asia/Colombo';
        //$date=Carbon::now($TZ);
        //$dt1 = Carbon::create(2016, 4, 21, 0, 0, 0);

    }

    ///////
    ////  employee reports
///////

     function getMemberNames(Request $request)
    {
        //$id = $request->session()->get('functions');
        $cid = Session::get('company_id');
        //return($id);
        $memberID = Member:: where('company_id', $cid)->get();
        //return($memberID);
        foreach ($memberID as $mId) {
            $members[] = MemberDetail::where('member_id', $mId)->value('name');
        }
        $names = implode(", ", $members);
        return ($names);
    }

    //get member details when select a member for employee report.
     function memberInfo(Request $request){
        $oProjects = array();
        $cProjects = array();
        $name = $request->input('name');
        $cid = Session::get('company_id');//get company ID from session
        //return($cid);

        $mems = MemberDetail::where('name', $name)->get();
        //return $mems;

         $authMems=array();
         foreach($mems as $t){
             $memberid=$t->member_id;
             //return $memberid;
             $memID=Member::where([['member_id',$memberid],['company_id',$cid]])->value('member_id');
             if($memID != null) {
                 array_push($authMems, $memID);
             }
         }
         //return $authMems;

        $EmpC = 0;
        $EmpI = 0;
        $EmpO = 0;
        $EmpEC = 0;
        $EmpEI = 0;
        $EmpSub = 0;

        $projectID = WorksOn::where('member_mid',$authMems[0])->select('project_pid')->get();
         //return $projectID;

         $projectNames=array(); //projects with status [tasks added, completed].
         foreach($projectID as $t) {
             $proids = $t->project_pid;
             $pname=Project::where('pid',$proids)->get();
             //return $pname;
             if($pname[0]->status==2||$pname[0]->status==3) {
                 array_push($projectNames,$pname[0]->pname);
             }
         }
         //return $projectNames;


        //return($projectID);

        foreach ($projectID as $pid) {
            $project = Project::where('pid', $pid['project_pid'])->select('pname', 'status', 'end_date')->first();
            $pStatus = $project->status;
            $pName[] = $project->pname;

            $deadline = Carbon::parse($project->end_date);

            $daysPassed = $deadline->diffInDays(carbon::now());
            //return($daysPassed );

            //return($project);
            //return($pStatus);

            $C = 0;
            $I = 0;
            $O = 0;
            $EC = 0;
            $EI = 0;
            $Sub = 0;

            $tasks = Task::where('project_pid', $pid['project_pid'])->get();

            //return $tasks;
            foreach ($tasks as $t) {

                $sub = Task::find($t->tid)->hasSubtask;

                foreach ($sub as $s) {


                    $id = $s->mem_id;


                    if ($authMems[0] == $id) {
                        $state = $s->status;
                        $sub_id = $s->stid;
                        $deadline = $s->deadline;
                        $deadline = Carbon::parse($deadline);
                        $due = $deadline->isFuture();

                        if (!$due) {
                            if ($state == 0)
                                $I++;
                            if ($state == 1)
                                $C++;
                            if ($state == 2)
                                $Sub++;
                            if ($state == 3) {
                                $extended = Extended::where('subtask_id', $sub_id)->value('status');
                                if ($extended == 0)
                                    $EI++;
                                if ($extended == 1)
                                    $EC++;
                            }
                            if ($state == 4)
                                $O++;

                        }
                    }
                }
            }
            $EmpC = $EmpC + $C;
            $EmpI = $EmpI + $I;
            $EmpO = $EmpO + $O;
            $EmpEC = $EmpEC + $EC;
            $EmpEI = $EmpEI + $EI;
            $EmpSub = $EmpSub + $Sub;

            $Da = array('ProjectName' => $project['pname'], 'daysPassed' => $daysPassed, 'completed' => $C,
            'incomplete' => $I, 'ExtComplete' => $EC, 'ExtInComplete' => $EI, 'Overdue' => $O, 'Submitted' => $Sub);
            //return $D;

            //return($cProjects);

        }

        $pCollection = collect($Da);
        $sorted = $pCollection->sortBy('daysPassed');
        $P = $sorted->values()->all();



        // return($cProjects);
         $projName = implode(", ", $pName);
         $cat_id=Member::where('member_id',$authMems[0])->value('category_id');
         $cat=Category::where('category_id',$cat_id)->value('cname');
         $EmpPro = array('category' => $cat, 'projects' => $projName, 'completed' => $EmpC, 'incomplete' => $EmpI,
             'ExtComplete' => $EmpEC, 'ExtInComplete' => $EmpEI, 'Overdue' => $EmpO, 'Submitted' => $EmpSub,
             'projectNames'=>$projectNames);
         return ($EmpPro);

    }

    // get developer names for emp report.(members having developer priviledge[9])
     function employeeName(){
        //$id = $request->session()->get('functions');
        $id = Session::get('company_id');
        $cats=Category::where('company_id',$id)->get();
        $catsID=array();
        foreach($cats as $t){
            array_push($catsID,$t->category_id);
        }
        //return $catsID;
        $devCats=array();
        foreach($catsID as $t){
            //$isDeveloper=0;
            $fids=CategoryFunctions::where('category_cid',$t)->get();
            //return $fids;
            foreach($fids as $f){
                $fID=$f->functions_fid;
                if($fID==9){
                    //$isDeveloper=1;
                    array_push($devCats,$t);
                }
            }
        }
        //return($devCats);
        $devCatMems=array();
        $Emp = Member::where('company_id', $id)->get();
        foreach($Emp as $e){
            $memCat=$e->category_id;
            foreach($devCats as $dc){
                if($memCat==$dc){
                    array_push($devCatMems,$e->member_id);
                }
            }
        }
        //return ($devCatMems);
        $Em=array();
        foreach ($devCatMems as $dcm) {
            $mm = MemberDetail::where('member_id', $dcm)->value('name');
            if($mm != null) {
                array_push($Em, $mm);
            }
        }
        $names = implode(", ", $Em);
        return ($names);

    }

    function getProjects(){
        //$id = $request->session()->get('functions');
        $id = Session::get('company_id');
        //return($id);
        $projects = Project::where('company_id', $id)->get();
        //return $projects;
        foreach ($projects as $t) {
            if($t->status==2||$t->status==3) {
                $p[] = $t->pname;
            }
        }
        $names = implode(", ", $p);
        return ($names);
    }
}

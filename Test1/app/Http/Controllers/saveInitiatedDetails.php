<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use App\Project;
use App\Member;
use App\MemberDetail;
use App\Task;
use Carbon\Carbon;
use DB;

class saveInitiatedDetails extends Controller
{
    function store(Request $request){
        $userID=Session::get('member_id');
        $companyID=Member::where('member_id',$userID)->value('company_id');
        $clientIDs=MemberDetail::where('name',$request->client)->get(); //get IDs having name.
        //return $clientIDs;
        $clientID = array();
        foreach($clientIDs as $t) {
            $cid = Member::where([['member_id',$t["member_id"]],['company_id',$companyID]])->value('member_id');
            //get ID in same company.
            array_push($clientID,$cid);
        }
        //return $clientID;
        $adderIDs=MemberDetail::where('name',$request->memberAdder)->get(); //get IDs having name.
        //return $adderIDs;
        $adderID = array();
        foreach($adderIDs as $t) {
            $cid = Member::where([['member_id',$t["member_id"]],['company_id',$companyID]])->value('member_id');
            //get ID in same company.
            array_push($adderID,$cid);
        }
        //return $adderID;
        //to check there is another project in same name inside company.
        $sameNamePro=Project::where([['pname',$request->name],['company_id',$companyID]])->value('pid');
        if($sameNamePro==null) {
            $project = new Project();
            $project->client_mid = $clientID[0];
            $project->project_manager_mid = $adderID[0];
            $project->techlead_mid = null;
            $project->pname = $request->name;
            $project->status = 0;
            $project->initial_cost = 0;
            $project->start_date = Carbon::today();
            $project->end_date = $request->deadline;
            $project->description = $request->description;
            $project->business_functions = $request->businessFunctions;
            $project->company_id = $companyID;
            $project->initiator_mid=$userID;
            $project->save();
        }else{
            return ("Project Name has all ready used.");
        }
    }

    function getIProjects(){
        //$companyID = Session::get('sessionCompanyID');
        $userID=Session::get('member_id');
        //$initiator=MemberDetail::where('member_id',$userID)->value('name');
        $companyID=Member::where('member_id',$userID)->value('company_id');
        $addedIPs=Project::where('company_id',$companyID)->get();
        //return $addedIPs;
        $initiatedProjects=array();
        foreach($addedIPs as $t){
            $client=MemberDetail::where('member_id',$t["client_mid"])->value('name');
            $adder=MemberDetail::where('member_id',$t["project_manager_mid"])->value('name');
            $initiator=MemberDetail::where('member_id',$t["initiator_mid"])->value('name');
            $st=$t["status"];
            $status="";
            if($st==0) $status="Initiated";
            elseif($st==1) $status="Members added";
            elseif($st==2) $status="Ongoing";
            elseif($st==3) $status="Completed";
            $IPs = array('pname'=>"$t->pname",'client_mid'=>"$client",'project_manager_mid'=>"$adder",'initiator_mid'=>"$initiator",
                'end_date'=>"$t->end_date", 'start_date'=>"$t->start_date",'status'=>$status,'pid'=>"$t->pid",
                'description'=>"$t->description",'bfunctions'=>"$t->business_functions");
            array_push($initiatedProjects,$IPs);
        }
        return $initiatedProjects;
    }

    function deleteIP(Request $request){
        $pID = $request->pid;
        Project::destroy($pID);
    }

    function edit(Request $request){
        $userID=Session::get('member_id');
        $companyID=Member::where('member_id',$userID)->value('company_id');
        //return $companyID;
        $clientName=$request->client_mid;
        $adderName=$request->project_manager_mid;
        $clients=MemberDetail::where('name',$clientName)->get();
        $adders=MemberDetail::where('name',$adderName)->get();
        //return $adders;
        $clientID = array();
        foreach($clients as $t) {
            $cid = Member::where([['member_id',$t["member_id"]],['company_id',$companyID]])->value('member_id');
            //get ID in same company.
            array_push($clientID,$cid);
        }
        //return $clientID;
        $adderID = array();
        foreach($adders as $t) {
            $cid = Member::where([['member_id',$t["member_id"]],['company_id',$companyID]])->value('member_id');
            //get ID in same company.
            array_push($adderID,$cid);
        }
        //return $adderID;

        DB::table('project')
            ->where('pid',$request->pid)
            ->update(['client_mid'=>$clientID[0],'project_manager_mid'=>$adderID[0],'pname'=>$request->pname,
                'end_date'=>$request->end_date,'description'=>$request->description,
                'business_functions'=>$request->bfunctions,'initiator_mid'=>$userID]);
        return("hi");
        /*
        $p = Project::where ("pid","$request->pid");
        $newIP = array("client_mid"=>$clientID[0],"project_manager_mid"=>$adderID[0],"pname"=>$request->pname,
            "end_date"=>$request->end_date,"description"=>$request->description,"business_functions"=>$request->bfunctions);
        $p->fill($newIP)->save();
        */
    }

    function getClientProjects(){
        $clientID = Session::get('member_id');
        //return $clientID;
        $pids=Project::where('client_mid',$clientID)->select('pname')->get();
        //return $pids;
        $arr=array();
        foreach($pids as $t){
            array_push($arr,$t["pname"]);
        }
        //return $arr;
        $pnames=implode(", ",$arr);
        return $pnames;
    }

    function getProjectDetails(Request $request){
        $pname=$request->name;
        $clientID = Session::get('member_id');
        $project=Project::where([['pname',$pname],['client_mid',$clientID]])->get();
        //return $project;
        $projectName=$project[0]["pname"];
        $endDate=$project[0]["end_date"];
        $startDate=$project[0]["start_date"];
        $description=$project[0]["description"];
        //
        $ed=Carbon::parse($endDate);
        $sd=Carbon::parse($startDate);
        $td=Carbon::today();
        $duration=$ed->diffInDays($sd);
        $timeTill=$ed->diffInDays($td);
        //return $timeTill;
        //
        $pid=$project[0]["pid"];
        $tasks=Task::where('project_pid',$pid)->get();
        //return $tasks;
        $com=array();
        $ong=array();
        $c=0;
        $cost=0;
        foreach($tasks as $t){
            if($t["status"]==1){ //completed task.
                array_push($com,$t["tname"]);
                $c=$c+1;
                $cost=$cost+$t["total_estimated_cost"];
            }
            else{//not completed.
                array_push($ong,$t["tname"]);
                $cost=$cost+$t["total_estimated_cost"];
            }
        }
        $pc=round(($c/sizeof($tasks))*100);
        //return $pc;
        $prDesc = array('name'=>"$projectName",'end'=>"$endDate",'start'=>"$startDate",'duration'=>"$duration  days",
            'timeTill'=>"$timeTill  days", 'cost'=>"$cost", 'desc'=>"$description",'pc'=>"$pc%",'com'=>$com,'ong'=>$ong);
        return $prDesc;
    }
}

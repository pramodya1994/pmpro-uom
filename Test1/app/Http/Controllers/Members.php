<?php

namespace App\Http\Controllers;

use App\CategoryFunctions;
use App\MemberDetail;
use App\Project;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Category;
use App\Member;
use App\WorksOn;
use Illuminate\Support\Facades\Session;
class Members extends Controller
{  //////////////get members for the selected category
    public function getMembers(Request $request)
    {   $names =array();
        $category = $request->input('category');
        $id = Session::get('company_id');
        $catid = Category::where([['cname',$category],['company_id',$id]])->value('category_id');
        $mem = Member::where('category_id',$catid)->get();

        foreach($mem as $m)
        {
            $name = MemberDetail::where('member_id',$m->member_id)->value('name');
            array_push($names,$name);
        }


        return ($names);


    }

    /////////////////get categories for which view assigned tassks privilege is assigned
    public function getCat(Request $request){
        $id = Session::get('company_id');
        $arr = array();
        $cat = Category::where('company_id',$id)->get();
        //return $cat;
        foreach($cat as $c)
        {
            $fid= CategoryFunctions::where('category_cid',$c->category_id)->get();
            foreach($fid as $f)
            {
                if ($f->functions_fid == 9)
                    array_push($arr, $c->cname);
            }
        }
        return $arr;
    }

    ///////////////////////////get categories for which the taskassign privilege is granted
     function getTaskAssignCat(Request $request)
     {
         $id = Session::get('company_id');
         $arr = array();
         $cat = Category::where('company_id',$id)->get();
         //return $cat;
         foreach($cat as $c)
         {
             $fid= CategoryFunctions::where('category_cid',$c->category_id)->get();
             foreach($fid as $f)
             {
                 if ($f->functions_fid == 7)
                     array_push($arr, $c->cname);
             }
         }
         return $arr;
     }

//////////// assign member to project for assigning n dividing the project tasks
       function addTaskAssignee(Request $request)
       {
           $cid = Session::get('company_id');
           $name = $request->input('memname');
           $pid = $request->input('Project');
           $memids = MemberDetail::where('name',$name)->select('member_id')->get();
           foreach($memids as $m)
           {
               $compid = Member::where('member_id', $m->member_id)->value('company_id');
               if ($compid == $cid)
               {
                   $memberid = $m->member_id;
                   break;
               }
           }
           Project::where('pid',$pid)->update(['techlead_mid'=>$memberid]);
           return 'ok';
       }
    //add members to project
    public function addMem(Request $request)
    {
        //return( $request->session()->all());
        $cid = Session::get('company_id');
        $name = $request->input('memname');
        $pid = $request->input('Project');
        $category = $request->input('category');
        $memids = MemberDetail::where('name',$name)->select('member_id')->get();
        foreach($memids as $m)
        {
            $compid=Member::where('member_id',$m->member_id)->value('company_id');
            if($compid == $cid ){
                $memberid = $m->member_id;
            }
        }
        $workId = WorksOn::where([['project_pid',$pid],['member_mid',$memberid]])->exists();

         if($workId){
             return ("1");
         }

        $work = new WorksOn;
            $work->project_pid = $pid;
            $work->member_mid = $memberid;
            $work->special_rate = 0;
            $work->save();

        return ("0");
    }

    public function deletemem(Request $request){
        $name = $request->input('memname');
        $pid = $request->input('Pid');
        $cid = Session::get('company_id');

        $memids = MemberDetail::where('name',$name)->select('member_id')->get();

        foreach($memids as $m)
        {
            $compid = Member::where('member_id', $m->member_id)->value('company_id');

            if ($compid == $cid ) {
                $memberid = $m->member_id;
                $mem = WorksOn::where([['project_pid',$pid],['member_mid',$memberid]])->first();

                $mem ->delete();

                break;
            }
        }
       // $pid = Project::where('pname',$project)->value('pid');
       // $mem = WorksOn::where([['project_pid',$pid],['member_mid',$memberid]]);
        //return $mem;




    }

}
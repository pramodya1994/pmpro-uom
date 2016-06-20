<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use File;
use App\Member;
use App\Role;
use App\MemberDetail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;

class addMemberController extends Controller
{
    public function store(Request $request){
        $companyID = Session::get('sessionCompanyID');

        //get previous category_id.
        $catName = $request->category;
        $catID = Role::where([['cname',$catName],['company_id',$companyID]])->value('category_id');

        $member = new Member;
        $member->company_id=$companyID;
        $member->category_id=$catID;
        $member->email=$request->email;
        $member->save();

        //return('member added');

        /*
        $data = array('name'=>"JANI");

        Mail::send(['text'=>'mail'], $data, function($message) {
            $message->to('bpmmendis94@gmail.com', 'laravel')->subject('Laravel Basic Testing Mail');
            $message->from('janindu.praneeth4@gmail.com','JANI');
        });
        echo " Email Sent ";
        */
    }

    public function getAddedMembers(Request $request){
        $companyID = Session::get('sessionCompanyID');

        //get added members using companyID.
        $addedMems = Member::where('company_id',$companyID)->get();
        //return $addedMems;
        $membersAdded = array();
        //get category name using category id of each member.
        foreach ($addedMems as $temp){
            $catName = Role::where('category_id',$temp->category_id)->value('cname');
            //check whether member is registered in member_details table.
            $status = MemberDetail::where('member_id',$temp->member_id)->exists();
            if($status){
                $memStatus='Registered';
            }
            else{
                $memStatus='Not Registered';
            }
            //return $memStatus;
            $d = $temp->created_at;
            $da = explode(" ",$d);
            $date = $da[0];
            $Mem = array('member_id'=>"$temp->member_id",'email'=>"$temp->email",'category'=>"$catName",
                'addedDate'=>"$date", 'memberStatus'=>"$memStatus");
            //return $Mem;
            array_push($membersAdded,$Mem);
        }
        return $membersAdded;
    }

    public function memberDelete(Request $request){
        $memID = $request->member_id;
        Member::destroy($memID);
        //on delete CASCADE, so no need to delete it seperately.
        //$deleteMemDetailsID = MemberDetail::where('member_id',$memID)->value('member_details_id');
        //MemberDetail::destroy($deleteMemDetailsID);
        return('member and details are deleted');
    }

    public function getMemberDetails(Request $request){
        $member_id = $request->member_id;
        $memDet = MemberDetail::where('member_id',$member_id)->get();
        return $memDet;
    }

    public function edit(Request $request){
        $companyID = Session::get('sessionCompanyID');
        $catID=Role::where([['company_id',$companyID],['cname',$request->input('newCat')]])->value('category_id');
        //return $request->input('memberID');
        $editMem=Member::find($request->input('memberID'));
        $editMem->email=$request->input('newEmail');
        $editMem->category_id=$catID;
        $editMem->save();
    }
}

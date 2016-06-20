<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use App\CategoryFunctions;
use App\Role;
use App\Member;
use App\MemberDetail;

class clientCtrl extends Controller
{
    public function getClients(Request $request)
    {
        $userID = Session::get('member_id');
        //return $userID;
        $companyID=Member::where('member_id',$userID)->value('company_id');
        //return $companyID;
        $catsArray = array();
        $cats = Role::where('company_id', $companyID)->get();
        //return $cats;
        foreach ($cats as $t) {
            $catHas12 = CategoryFunctions::where([['category_cid', $t["category_id"]], ['functions_fid', 12]])->value('category_cid');
            array_push($catsArray, $catHas12);
        }
        //return $catsArray;
        $clientNames = array();
        foreach($catsArray as $t){
            $mems = Member::where('category_id', $t)->get();
            //return $mems;
            foreach($mems as $m){
                $memName = MemberDetail::where('member_id',$m["member_id"])->value('name');
                if($memName != null) {
                    array_push($clientNames, $memName);
                }
            }
        }
        //return $mems;
        //return $clientNames;
        $cnames = implode(", ",$clientNames);
        return $cnames;
    }
}

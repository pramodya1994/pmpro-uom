<?php

namespace App\Http\Controllers;
use App\Member_details;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Hash;
use App\Member;
use App\MemberDetail;
use App\Category;
use App\CategoryFunctions;
use App\Func;
use App\Company;
use Illuminate\Http\Request;
use App\Http\Requests;

use App\Http\Controllers\Controller;
class userController extends Controller
{
     function login(Request $request)
    {
        $email = $request->input('email');
        $pass = $request->input('password');
        $memid = Member::where('email',$email)->value('member_id');
        $mem = MemberDetail::where('member_id',$memid)->value('password');
        // checkin wether enterd pass n hashed pass is correct
        if($pass == $mem){
            $user = Member::where('email', $email)->value('category_id');
            //$memid = member::where('email', $email)->value('member_id');
            $company_id = Member::where('email', $email)->value('company_id');
            $roles = CategoryFunctions::where('category_cid',$user)->get();
            foreach($roles as $r) {
                $s[]= Func::where('fid',$r->functions_fid)->value('fname');
            }
            $a=  json_encode($s);
            //Session::put('functions',$a);
            Session::put('company_id',$company_id);
            Session::put('member_id',$memid);
            //return ($request->session()->all());
            return View::make('Projectindex')->with('privileges',$s);

        }

    }

     function register(Request $request){
        $email = $request->input('email');
        $name = $request->input('name');
        $pass = $request->input('password');
        $contact = $request->input('contact');
        //$hashpass= Hash::make($pass);

         // echo('hi');
        $member = new MemberDetail();

        $member -> name  =$name;
        $member -> password =$pass;
        $member -> contact_no = $contact;
        $member->save();
        return View::make('login');
    }


}


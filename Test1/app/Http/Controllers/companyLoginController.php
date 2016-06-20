<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Auth;
use File;

use App\Company;
use Illuminate\Support\Facades\Session;

class companyLoginController extends Controller
{
    public function checkUser(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        //return redirect('/view/Roles.html');
        //return View::get(public_path().'/view/Roles.html');
        $result = company::where([['email',$email],['password',$password]])->value('company_id');
        $ps = company::where([['email',$email],['password',$password]])->value('email');
        Session::put('sessionCompanyID',$result);
        return $result;
    }
}

<?php

namespace App\Http\Controllers;

use App\Category;
use App\MemberDetail;
use Illuminate\Http\Request;
use App\Role;
use App\CategoryFunctions;
use App\Func;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;

class addRoleController extends Controller
{
    public function store(Request $request)
    {
        $companyID = Session::get('sessionCompanyID');

        //$roles = array();
        $roles = $request->input('roles');
        //return $roles;

        foreach ($roles as $r) {
            $catName = $r["name"];
            $rate = $r["rate"];

            $catID1 = Role::where([['cname', $catName], ['company_id', $companyID]])->value('category_id');
            if ($catID1 > 0) { //category is in the table.
                //DB::table('category')->where('category_id', $catID1)->update(['rate' => $rate]);
                $cat=Category::find($catID1);
                $cat->rate=$rate;
                $cat->save();
                //delete all category has functions rows.
                //DB::table('category_has_functions')->where('category_cid', '=', '$catID1')->delete();
                CategoryFunctions::where('category_cid',$catID1)->delete();

            } else {
                //request->category table.
                $role = new Role();
                $role->company_id = $companyID;
                $role->cname = $catName;
                $role->rate = $rate;
                $role->save();
            }

            //get category_id of previous step.
            $catID = Role::where([['cname', $catName], ['company_id', $companyID], ['rate', $rate]])->value('category_id');

            //request-> category_has_functions table.
            $functionArray = $r["selectedPriviledges"];
            //remove duplicate priviledge ids from array.
            $uniqueFunctionIDs=array_unique($functionArray);
            //return $uniqueFunctionIDs;
            //return ($functionArray);
            for ($i = 0; $i < count($functionArray); $i++) {
                //return ($functionArray[$i]);
                $catHasFunctions = new CategoryFunctions();
                $catHasFunctions->category_cid = $catID;
                $catHasFunctions->functions_fid = $functionArray[$i];
                $catHasFunctions->save();
            }

            //return ('hi');
        }


    }

    public function getCategories(Request $request)
    {
        $companyID = Session::get('sessionCompanyID');
        $roles = Role::where('company_id', $companyID)->get();
        foreach ($roles as $cat) {
            $cats[] = $cat->cname;
        }
        $cNames = implode(", ", $cats);
        return $cNames;
    }

    //get categories to dialog box.
    function getCategoriesDialog(){
        $companyID = Session::get('sessionCompanyID');
        $roles = Role::where('company_id', $companyID)->get();
        //return $roles;
        $cats=array();
        foreach($roles as $t){
            array_push($cats,$t->cname);
        }
        return $cats;
    }

    //get rates for recomended roles.
    function getRates(){
        $companyID = Session::get('sessionCompanyID');
        $roles = Role::where('company_id', $companyID)->get();
        //return $roles;
        $iniRate=0; $pmRate=0; $techRate=0; $smRate=0; $devRate=0;
        foreach($roles as $t){
            $cat=$t->cname;
            if($cat=="Project Initiator"){$iniRate=$t->rate;}
            elseif($cat=="Project Manager"){$pmRate=$t->rate;}
            elseif($cat=="Techlead"){$techRate=$t->rate;}
            elseif($cat=="Senior Manager"){$smRate=$t->rate;}
            elseif($cat=="Developer"){$devRate=$t->rate;}
        }
        $rateArr=array('iniRate'=>$iniRate,'pmRate'=>$pmRate,'techRate'=>$techRate,
            'smRate'=>$smRate, 'devRate'=>$devRate);
        return $rateArr;
    }

    //get added categories.
    public function getAddedRoles(Request $request)
    {
        $companyID = Session::get('sessionCompanyID');

        //get added categories using companyID.
        $addedCats = Role::where('company_id', $companyID)->get();
        //return $addedCats;
        $categoriesAdded = array();
        //get category name using category id of each member.
        foreach ($addedCats as $temp) {
            $catName = $temp["cname"];
            $catrate = $temp["rate"];
            $catid = $temp["category_id"];
            //return $catid;
            //$catid = 32;

            //take functions of that category.
            $privs = CategoryFunctions::where('category_cid', $catid)->get();
            //return $privs;
            $fids = array();
            foreach ($privs as $p) {
                $fid = $p['functions_fid'];
                array_push($fids, $fid);
            }
            //return $fids;

            $Rol = array('name' => "$catName", 'rate' => "$catrate", 'selectedPriviledges' => $fids);
            //return $Rol;
            array_push($categoriesAdded, $Rol);
        }
        return $categoriesAdded;
    }

    function deleteRole(Request $request){
        $companyID = Session::get('sessionCompanyID');
        $deleteRoleName=$request->input('name');
        //return($deleteRoleName);
        $deleteCatID=Role::where([['cname',$deleteRoleName],['company_id',$companyID]])->value('category_id');
        Role::destroy($deleteCatID);
    }

    function editRole(Request $request){
        $companyID = Session::get('sessionCompanyID');
        $oldName=$request->input('oldName');
        $catID=Role::where([['cname',$oldName],['company_id',$companyID]])->value('category_id');
        //return $catID;
        //should write update querry.
        $editcat=Role::find($catID);
        $editcat->cname=$request->input('newName');
        $editcat->rate=$request->input('newRate');
        $editcat->save();
    }

    function deleteAll(){
        $companyID = Session::get('sessionCompanyID');
        $cats=Category::where('company_id',$companyID)->get();
        foreach ($cats as $t){
            Category::destroy($t->category_id);
        }
    }
}

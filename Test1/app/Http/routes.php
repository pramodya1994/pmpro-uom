<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('/index');
});

//register company (form->db).
Route::post('/view/signupCL','companyRegController@store');

//Delete a member in table->members.
Route::post('/deleteMember','addMemberController@memberDelete');

//get member details(member_details table).
Route::post('/getMemberDetails','addMemberController@getMemberDetails');

//return memberLogin view.
Route::get('/getML',function(){
    return view('memberLogin');
});

//Delete initialized project.
Route::post('/deleteInitiatedDetails','saveInitiatedDetails@deleteIP');





/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //login company (db->check).
    Route::post('/view/loginCL','companyLoginController@checkUser');

    //add role (form->db).
    Route::post('/view/addOwnRoles','addRoleController@store');

    //get category names.
    Route::get('/addedCategories','addRoleController@getCategories');

    //get category names to dialog box.
    Route::get('/addedCategoriesDialog','addRoleController@getCategoriesDialog');

    //delete roles.
    Route::post('/deleteRole','addRoleController@deleteRole');

    //edit roles.
    Route::post('/editCategory','addRoleController@editRole');

    //delete all recomended roles.
    Route::post('/deleteRecomendedRoles','addRoleController@deleteAll');

    //get rates of recomended roles.
    Route::get('/getCategoriesRecomended','addRoleController@getRates');

    //add members by super admin of company (form->db).
    Route::post('/addMember','addMemberController@store');

    //get added members(DB->table).
    Route::get('/addedMembers','addMemberController@getAddedMembers');

    //edit members by super admin of company (form->db).
    Route::post('/editMemberBasicDetails','addMemberController@edit');

    //login member.
    Route::post('/memberLogin','userController@login');

    //get added categories(DB->table).
    Route::get('/addedRoles','addRoleController@getAddedRoles');

    //get clients(DB->autocomplete).
    Route::get('/getClients','clientCtrl@getClients');

    //get clients(DB->autocomplete).
    Route::get('/getMemberAdders','memberAdderCtrl@getMemberAdders');

    //save initiated project details(form->DB).
    Route::post('/saveInitiatedDetails','saveInitiatedDetails@store');

    //get clients(DB->autocomplete).
    Route::get('/getInitiatedProjects','saveInitiatedDetails@getIProjects');

    //edit initiated project details(form->DB).
    Route::post('/editInitiatedDetails','saveInitiatedDetails@edit');

    //get projects assigned to clients(DB->autocomplete).
    Route::get('/getClientProjects','saveInitiatedDetails@getClientProjects');

    //get project details for client report(DB->autocomplete).
    Route::post('/getProjectDetails','saveInitiatedDetails@getProjectDetails');

    //=======ruwini=========
    Route::get('/initiatedProjects','Report@getProjects');//->right.
    Route::post('/ongoingProjectsRuwini','Report@getReportDetails'); //get project report details.->liyala na
    Route::post('/viewMemberReports','Report@memberInfo'); //get employee report details.->right
    Route::get('/memberReports','Report@employeeName'); // load employee names to auto complete for employee reports.->right
    Route::get('/memberProjectReports','Report@projectNameForEmp');//->liyala na

    //=======sachini=========
    //get initiated projectNames assigned to member (developer,PM,TL)*********
    Route::get('/initiatedProjects','ProjectsController@getInitiatedProjects');

    //get initiated project details inorder to assign mems n delierables******
    Route::post('/assignedprojects','ProjectsController@getProjectDetails');


    //add mems n dels in view add memesn dels - initiated project****************
    Route::post('/addMembersDeliverables','ProjectsController@addMembersDeliverables');

    //add members to a project*****
    Route::post('/addMembers','Members@addMem');

    //add member to assign tasks for the project****
    Route::post('/addMemberToAssignTask','Members@addTaskAssignee');

    //add deliverables to a project*****
    Route::post('/addDeliverables','ProjectsController@addDeliverable');

    //delete deliverables froma project******
    Route::post('/deleteDeliverables','ProjectsController@deleteDel');

    //getProjects that can be edited*****
    Route::get('/getProjectsToEdit','ProjectsController@getProjectToEdit');

    //get categories of company with view task privilege*****
    Route::get('/getCategories','Members@getCat');

    //get all company members to be added to projects*****
    Route::post('/getMembers','Members@getMembers');

    //get categories of company with assign task privilege******
    Route::get('/getTaskassignCat','Members@getTaskAssignCat');


    //getProjectsNames to select to view tasks n timesheet*****
    Route::get('/getProjectsToDisplay','ProjectsController@getProjectsToViewTimesheetandTasks');

    //get members n deliverables of a project to display for editing*****
    Route::post('/editAddedMemsnDels','ProjectsController@getMembersnDeliverables');

    //delete a membet from a project*****
    Route::post('/deleteMemberFromProject','Members@deletemem');

    //uddate a deliverable in an ongoing project*****
    ROute::post('/updateDeliverables','ProjectsController@updateDeliverable');

    //view timesheets****
    Route::post('/timesheet','Timesheet@projectCost');

    //view ongoing project details****
    Route::post('/ongoingProjects','ProjectsController@getOngoing');

    //approve task*****
    Route::post('/approveTask','TaskController@approve');

    //rollback approval*****
    Route::post('/CancelTask','TaskController@cancel');

    //approve extended task
    Route::post('/approveETask','TaskController@approveExt');

    //cancelExtendedTask********
    Route::post('/cancelExtended','TaskController@cancelExtended');

});

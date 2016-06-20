<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;

class VerifyCsrfToken extends BaseVerifier
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        '/view/loginCL',
        '/view/addOwnRoles',
        '/addedCategories',
        '/addMember',
        '/addedMembers',
        '/memberLogin',
        '/getClients',
        '/getMemberAdders',
        '/saveInitiatedDetails',
        '/getInitiatedProjects',
        '/editInitiatedDetails',
        '/getClientProjects',
        '/deleteRole',
        '/editCategory',
        '/addedCategoriesDialog',
        '/editMemberBasicDetails',
        '/getProjectDetails',
        '/ongoingProjectsRuwini',
        '/viewMemberReports',
        '/memberReports',
        '/memberProjectReports',
        '/deleteRecomendedRoles',
        '/getCategoriesRecomended',
        '/initiatedProjects',
        '/assignedprojects',
        '/addMembers',
        '/addMemberToAssignTask',
        '/addDeliverables',
        '/deleteDeliverables',
        '/getProjectsToEdit',
        '/getCategories',
        '/getMembers',
        '/getTaskassignCat',
        '/getProjectsToDisplay',
        '/editAddedMemsnDels',
        '/deleteMemberFromProject',
        '/updateDeliverables',
        '/timesheet',
        '/ongoingProjects',
        '/approveTask',
        '/CancelTask'
    ];
}

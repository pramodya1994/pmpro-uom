angular.module('MyApp', ['ngMaterial', 'ngMessages', 'smart-table', 'ui.bootstrap'])


    //nikan damme.
    .controller('safeCtrl', function () {
    })


    /*
     //****************************************************************
     //config template urls.
     //****************************************************************
     .config(function($routeProvider,$locationProvider){
     $routeProvider
     .when('/docRoles',{
     templateUrl:'/view/Roles.html'

     });
     })

     */


    .config(function ($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

    })

    //**********************************************************************
    //dialog controller
    //**********************************************************************

    .controller('DialogCtrl', function ($scope, $mdDialog, $mdMedia) {
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent('You can specify some description text in here.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        };
        $scope.showConfirm = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Please do it!')
                .cancel('Sounds like a scam');
            $mdDialog.show(confirm).then(function () {
                $scope.status = 'You decided to get rid of your debt.';
            }, function () {
                $scope.status = 'You decided to keep your debt.';
            });
        };
        $scope.showAdvanced = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialog1.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        $scope.showTabDialog = function (ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'tabDialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
    })

    //***********************************************
    //controller of select roles to add members.
    //addUsersCL.html
    //***********************************************
    //service.
    .service('roles', function projects($http, $q) {
        var role = this; //role is the service name.
        role.categories = [];
        //method to fill category names for auto-complete.
        role.getAddedCategories = function () {
            var defer = $q.defer();
            $http.get('/addedCategories')
                .success(function (res) {
                    defer.resolve(res);
                    role.categories = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }
        //method to get details of added members to table.
        role.addedMembers = [];
        role.getAddedMembers = function () {
            var defer = $q.defer();
            $http.get('/addedMembers')
                .success(function (res) {
                    defer.resolve(res);
                    role.addedMembers = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }
        //get categories for dialog box to edit.
        role.categoriesD = [];
        //method to fill category names for Dialog edit.
        role.getAddedCategoriesDialog = function () {
            var defer = $q.defer();
            $http.get('/addedCategoriesDialog')
                .success(function (res) {
                    defer.resolve(res);
                    //role.categoriesD = res.data;
                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }

        return role; //return service here.
    })


    //controller.
    // auto-complete,view table=>addUsersCL.html
    .controller('roleSelectCtrl', function ($timeout, $scope, $window, $http, $q, $log, $mdDialog, $mdMedia, roles) {
        var self = this;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        self.states = roles.getAddedCategories().then(
            function (res) {
                //console.log(res);
                return res.split(/, +/g).map(function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state
                    };
                });
            },
            function () {
                console.log('couldnt fetch role names.');
            });


        //button function-Add member.
        $scope.reloadRoute = function () {
            $window.location.reload(); //realod page.
        }
        $scope.addMember = function () {
            var memberEmail, memberCat;
            memberEmail = $scope.email;
            memberCat = $('#categoryName').val();
            var member = {'email': memberEmail, 'category': memberCat};
            //console.log(member);
            //sent to DB.
            $http({
                method: 'POST',
                url: '/addMember',
                data: member,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    //clearing input fields.
                    $scope.email = null;
                    //$scope.cat = null;
                    $scope.addMembersForm.$setUntouched();
                    $scope.reloadRoute();

                    if (status != 200) {
                        alert("Error - check email added")
                    }
                });
        }


        //update view html table.
        $scope.addedMembers = [];

        roles.getAddedMembers().then(
            function (res) {
                //onsole.log(res);
                $scope.addedMembers = res;

                //return res;
                console.log($scope.addedMembers);
            },
            function (err) {
                console.log('error occured : ' + err);
            }
        )


        //get today's date=>take date for the view(added members) table from input added now.
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        //var today = dd+'/'+mm+'/'+yyyy;
        var today = yyyy + '-' + mm + '-' + dd; //changed date format.
        var sta = 'Not Registered';//initial status of a member is 'Not Registered'.

        //row delete function.(smart table)
        //removeItem(mem);
        var memberDelete = {};
        $scope.selectItem = function (row) {
            var index = $scope.addedMembers.indexOf(row);
            memberDelete = $scope.addedMembers[index];
            memberDelete.ArrIndex = index;
            $scope.newEmail = memberDelete.email;
            $scope.selected = memberDelete.category;
            console.log(memberDelete);
        }

        $scope.removeItem = function () {
            $http({
                method: 'POST',
                url: '/deleteMember',
                data: memberDelete,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}
                // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    //console.log(status);
                    if (status == 200) {
                        //alert("Succes");
                        //$window.location.reload();
                        for (var i = 0; i < $scope.addedMembers.length; i++) {
                            if ($scope.addedMembers[i].member_id == memberDelete.member_id) {
                                $scope.addedMembers.splice(i, 1);
                            }
                        }
                    } else {
                        alert("Error");
                    }
                });
        }


        //edit dialog box function.(added members table->addUsersCL.html)
        var editMemberID;
        $scope.showEdit = function (ev, row) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'editDialogAddUsersCL.html',//include the html page u want to link
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            //get member want to edit.
            var index = $scope.addedMembers.indexOf(row);
            editMemberID = $scope.addedMembers[index].member_id;
            console.log(editMemberID);
        }
        //add edit details to member table.


        //show profile dialog box function.(added members table->addUsersCL.html)
        var showProf = {};
        $scope.showProfile = function (row) {
            //show profile details -> fill data to dialog box.
            var index = $scope.addedMembers.indexOf(row);
            showProf = $scope.addedMembers[index];
            //$scope.gettedMemDetail.name = "nimal";
            console.log(showProf);
            $http({
                method: 'POST',
                url: '/getMemberDetails',
                data: showProf,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}
                // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    //console.log(status);
                    $scope.gettedMemDetail = {};
                    console.log(data);
                    $scope.gettedMemDetail = data;
                    //console.log("hell", $scope.gettedMemDetail);
                });

        }


        //close dilog box function.

        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };

        //boostrap typeahead.
        //var selected;
        $scope.selected = undefined;
        //$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        // Any function returning a promise object can be used to load values asynchronously
        roles.getAddedCategoriesDialog().then(function (res) {
            $scope.states = res;
        });
        $scope.editMember = function () {
            //console.log(memberDelete);
            var memEdit = {};
            memEdit.memberID = memberDelete.member_id;
            memEdit.newEmail = $scope.newEmail;
            memEdit.newCat = $scope.selected;
            console.log(memEdit);
            $http({
                method: 'POST',
                url: '/editMemberBasicDetails',
                data: memEdit,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}
                // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    $scope.addedMembers[memberDelete.ArrIndex].email = $scope.newEmail;
                    $scope.addedMembers[memberDelete.ArrIndex].category = $scope.selected;
                    //$window.location.reload();
                })
                .error(function (data, status) {
                    console.log(status);
                    alert("Server Error :" + status + "  All the fields should be completed")
                });
        }


        //auto-complete thing.
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.newState = newState;
        function newState(state) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }

        // Internal methods
        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch(query) {
            var results = query ? self.states.filter(createFilterFor(query)) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }


        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    })



    //*******************************************************
    //controller of input message in roles
    //*******************************************************

    .controller('InputMessageRolesCtrl', function ($scope) {
        $scope.project = {
            description: 'Nuclear Missile Defense System',
            rate: 500
        };
    })


    //**********************************************************
    //sign up Controller
    //**********************************************************

    .controller('signupCtrl', function ($http, $scope, $window) {
        var company = {};

        $scope.company = company;
        /* Project.get()
         .success(function(data){
         $scope.projects = data;
         }); */
        $scope.signupCompany = function () {

            console.log(company);

            $http({
                method: 'POST',
                url: '/view/signupCL',
                data: company,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    console.log(status);
                    if (status == 200) {
                        // if not successful, bind errors to error variables
                        //$scope.errorName = data.errors.name;
                        //$scope.errorSuperhero = data.errors.superheroAlias;
                        alert("Succes");
                        $window.location.href = '/view/loginCL.html';
                    } else {
                        alert("Error");
                        // if successful, bind success message to message
                        //$scope.message = data.message;

                    }
                });
        };
    })


    //**********************************************************
    //Log In Controller
    //**********************************************************

    .controller('loginCtrl',
        function ($http, $scope, $window) {
            var companyUser = {};

            $scope.companyUser = companyUser;
            /* Project.get()
             .success(function(data){
             $scope.projects = data;
             }); */
            $scope.loginCompany = function () {

                console.log(companyUser);

                $http({
                    method: 'POST',
                    url: '/view/loginCL',
                    data: companyUser,  // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (data) {
                        var suc = data;
                        console.log(suc);
                        if (suc > 0) {
                            alert("Success");
                            $window.location.href = '/view/Roles.html';
                        } else {
                            alert("Error");

                        }
                    });
            };
        })


    //**********************************************************
    //add role Controller
    //addOwnRoles.html
    //**********************************************************
    //service->fill view table (added categories).
    .service('rolesx', function projects($http, $q) {

        var role = this; //role is the service name.
        //method to get details of added categories to table.
        role.selectedData = [];
        role.getAddedRoles = function () {
            var defer = $q.defer();
            $http.get('/addedRoles')
                .success(function (res) {
                    defer.resolve(res);
                    role.selectedData = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }
        //return role; //return service here.
    })
    //get rates for recomended roles table.
    .service('recRoleRates', function rrr($http, $q) {
        var rr = this;
        rr.selectedData = [];
        rr.getRates = function () {
            var defer = $q.defer();
            $http.get('/getCategoriesRecomended')
                .success(function (res) {
                    defer.resolve(res);
                    rr.selectedData = res.data;
                })
                .error(function (err) {
                    defer.reject(err);
                })
            return defer.promise;
        }
    })



    //controller
    .controller('addRolesCtrl', function ($timeout, $scope, $window, $http, $q, $log, $mdDialog, $mdMedia, rolesx, recRoleRates) {

        $scope.priviledges = [{
            name: 'Initiate new projects', id: 1
        }, {
            name: 'View initiated projects', id: 2
        }, {
            name: 'Add members and deliverables', id: 3
        }, {
            name: 'View ongoing project details', id: 4
        }, {
            name: 'View time sheets', id: 5
        }, {
            name: 'View project reports', id: 6
        }, {
            name: 'Add tasks and assign members', id: 7
        }, {
            name: 'Edit tasks and extend hours', id: 8
        }, {
            name: 'View assigned tasks', id: 9
        }, {
            name: 'View completed tasks', id: 10
        }, {
            name: 'View employee reports', id: 11
        }, {
            name: 'Client priviledge', id: 12
        }];

        $scope.selection = [];

        $scope.toggleSelection = function toggleSelection(priviledgeid) {
            var idx = $scope.selection.indexOf(priviledgeid);

            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            } else {
                $scope.selection.push(priviledgeid);
            }
        };


        var role = {};
        var selectedData = [];
        $scope.role = role;
        $scope.selectedData = selectedData;
        //console.log(selectedData);

        //update view html table.
        //$scope.selectedData = [];


        rolesx.getAddedRoles().then(
            function (res) {
                //console.log(res);
                //var getData = []; //hold roles got from db.
                getData = res;
                selectedData = getData;
                $scope.selectedData = selectedData;
                //return res;
                //console.log($scope.selectedData);
            },
            function (err) {
                //console.log('error occured : ' + err);
                window.alert("Error occured when updating table.")
            }
        )


        //role->db
        $scope.addData = function () {
            var privilegdeData = $scope.selection;
            var roles = {};
            roles.name = role.name;
            roles.rate = role.rate;
            roles.selectedPriviledges = privilegdeData;
            var ss = $scope.selectedData;
            var ww = 1;
            for (var i = 0; i < ss.length; i++) {
                if (roles.name == ss[i].name) {
                    //$scope.selectedData[i]=roles;
                    alert("Category you entered is allready added.");
                    ww = 0;
                }
            }
            if (ww == 1) {
                $scope.selectedData.push(roles);
            }
            //console.log($scope.selectedData);
            //clear fields after submit.
            $scope.selection = [];
            $scope.role.name = null;
            $scope.role.rate = null;
            $scope.RolesForm.$setUntouched();
        };

        //delete roles from view.
        var roleDelete = {};
        $scope.selectItem = function (row) {
            var sd = $scope.selectedData;
            var index = sd.indexOf(row);
            roleDelete = sd[index];
            $scope.editName = roleDelete.name;
            $scope.editRate = roleDelete.rate;
            console.log(roleDelete);
        }
        $scope.deleteItem = function () {
            //console.log(roleDelete);
            var sn = roleDelete.name;
            var index;
            for (var i = 0; i < selectedData.length; i++) {
                if (sn == selectedData[i].name) {
                    index = i;
                }
            }
            selectedData.splice(index, 1);
            //console.log(selectedData);
            var privArr = [];
            for (var i = 0; i < selectedData.length; i++) {
                var privs = selectedData[i].selectedPriviledges;
                for (var j = 0; j < privs.length; j++) {
                    var priv = privs[j];
                    //if item is not in array, push in to array.
                    if (privArr.indexOf(priv) == -1) {
                        privArr.push(priv);
                        //divs = jQuery.unique( divs );
                    }
                }
            }
            console.log(privArr);
            if (privArr.length == 12)
                isAccepted = true;
            else
                isAccepted = false;
            if (isAccepted) {
                //$scope.selectedData.splice(index,1);
                $scope.selectedData = selectedData;

                console.log(selectedData);
                //remove from db.
                $http({
                    method: 'POST',
                    url: '/deleteRole',
                    data: roleDelete, // pass in data as strings
                    headers: {
                        'Content-Type': 'application/json'
                    } // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (status) {
                        console.log(status);
                        alert("succesfully deleted your company roles.")
                    });
            }
            else {
                window.alert("You can not delete this role. First add function only assigned to this role to another role.");
                $window.location.reload();
            }
        }

        //edit roles.
        $scope.editCat = function () {
            var sn = roleDelete.name;
            var index;
            for (var i = 0; i < selectedData.length; i++) {
                if (sn == selectedData[i].name) {
                    index = i;
                }
            }
            var editRole = {};
            editRole.oldName = selectedData[index].name;
            editRole.newName = $scope.editName;
            editRole.newRate = $scope.editRate;
            console.log(editRole);
            if (editRole.newName != undefined && editRole.newRate != undefined) {
                $http({
                    method: 'POST',
                    url: '/editCategory',
                    data: editRole, // pass in data as strings
                    headers: {
                        'Content-Type': 'application/json'
                    } // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (status) {
                        //console.log(status);
                        selectedData[index].name = $scope.editName;
                        selectedData[index].rate = $scope.editRate;
                        //console.log(selectedData);
                        alert("success");
                    });
            } else {
                alert("ERROR : All fields should be completed.");
            }
        }

//add company roles to DB.
        $scope.addRoles = function () {
            var data = {};
            data.roles = selectedData;
            console.log(data);
            var isAccepted; //all priviledges have divided among roles.
            var privArr = []; //take assigned priviledges.
            for (var i = 0; i < selectedData.length; i++) {
                var privs = selectedData[i].selectedPriviledges;
                for (var j = 0; j < privs.length; j++) {
                    var priv = privs[j];
                    //if item is not in array, push in to array.
                    if (privArr.indexOf(priv) == -1) {
                        privArr.push(priv);
                    }
                }
            }
            console.log(privArr);
            if (privArr.length == 12)
                isAccepted = true;
            else
                isAccepted = false;

            if (isAccepted == true) {
                $http({
                    method: 'POST',
                    url: '/view/addOwnRoles',
                    data: data, // pass in data as strings
                    headers: {
                        'Content-Type': 'application/json'
                    } // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (status) {
                        console.log(status);
                    });
                window.alert("succesfully submited your company roles.")
            }
            else {
                window.alert("You can not submit - All functions not divided.")
            }
        }


//add recommended roles
        $scope.addRecomendedRoles = function () {
            var isAccepted; //all rates added.
            data = {
                roles: [
                    {name: "Project Initiator", rate: $scope.Data.iniRate, selectedPriviledges: [1, 2]},
                    {name: "Project Manager", rate: $scope.Data.pmRate, selectedPriviledges: [3, 4, 5, 6]},
                    {name: "Techlead", rate: $scope.Data.techRate, selectedPriviledges: [5, 6, 7, 8]},
                    {name: "Senior Manager", rate: $scope.Data.smRate, selectedPriviledges: [5, 6, 11]},
                    {name: "Developer", rate: $scope.Data.devRate, selectedPriviledges: [9, 10]},
                    {name: "Client", rate: 0, selectedPriviledges: [12]}
                ]
            };
            isAccepted = $scope.Data.iniRate != null && $scope.Data.pmRate != null &&
                $scope.Data.techRate != null && $scope.Data.smRate != null
                && $scope.Data.devRate != null;
            console.log(isAccepted);

            if (isAccepted == true) {
                $http({
                    method: 'POST',
                    url: '/view/addOwnRoles',
                    data: data, // pass in data as strings
                    headers: {
                        'Content-Type': 'application/json'
                    } // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (status) {
                        console.log(status);
                        window.alert("succesfully submited your company roles.")
                    })
                    .error(function () {
                        window.alert("Error")
                    });
            }
            else {
                window.alert("You can not submit - All salary rates not entered.")
            }
        }

        //delete all cats in recommended roles page.
        $scope.deleteRecomendedRoles = function () {
            $http({
                method: 'POST',
                url: '/deleteRecomendedRoles',
                //data: data, // pass in data as strings
                headers: {
                    'Content-Type': 'application/json'
                } // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (status) {
                    //console.log(status);
                    window.alert("succesfully deleted your company roles.")
                })
                .error(function (status) {
                    window.alert("Error")
                });
        }

        //set rates to recommended roles.
        recRoleRates.getRates().then(
            function (res) {
                //console.log(res);
                //var getData = []; //hold roles got from db.
                getData = res;
                Data = getData;
                $scope.Data = Data;
                //return res;
                console.log($scope.Data);
            },
            function (err) {
                //console.log('error occured : ' + err);
                window.alert("Error occured when updating table.")
            }
        )
    })



    //*********************************************
    //confirm password directive.
    //*********************************************

    .
    directive("passwordVerify", function () {
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(function () {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function (value) {
                    if (value) {
                        ctrl.$parsers.unshift(function (viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    })


    // *********************************************
    // controller of auto complete goes from here.
    // *********************************************
    .controller('DemoCtrl', DemoCtrl);
function DemoCtrl($timeout, $q, $log) {
    var self = this;
    self.simulateQuery = false;
    self.isDisabled = false;
    // list of `state` value/display objects
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.newState = newState;
    function newState(state) {
        alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    }


    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states,
            deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(results);
            }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };
    }
}


//dialog controller function
function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}





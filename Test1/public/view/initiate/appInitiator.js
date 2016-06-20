angular.module('InitiatorApp', ['ngMaterial', 'ngMessages', 'ui.router','smart-table','ui.bootstrap'])

    .config(function ($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise('/projectInitiate');

        $stateProvider
            .state('initiateIndex', {
                url: '/initiateIndex',
                templateUrl: 'initiateIndex.html'
            })

            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('Initiate new projects', {
                url: "/projectInitiate",
                templateUrl: 'view/initiate/projectInitiate.html'
            })

            .state('View initiated projects', {
                url: "/viewInitiatedProjects",
                templateUrl: 'view/initiate/viewInitiatedProjects.html'
            })

            .state('editInitiatedProjects', {
                url: "/editInitiatedProjects",
                templateUrl: 'view/initiate/editInitiatedProjects.html'
            })


    })



    //***********************************************
    //controller to add initiated projects to table.
    //viewInitiateProjects.html
    //***********************************************
    //service.
    .service('iniPro', function projects($http, $q) {
        var role = this; //role is the service name.
        //method to get details of added members to table.
        role.ips = [];
        role.getIProjects = function () {
            var defer = $q.defer();
            $http.get('/getInitiatedProjects')
                .success(function (res) {
                    defer.resolve(res);
                    role.ips = res.data;
                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }
        return role; //return service here.
    })

    //controller.
    .controller("viewInCtrl", function ($scope,$filter,$window, iniPro,transfer) {
        //update view html table.
        $scope.initiatedProjects = [];
        iniPro.getIProjects().then(
            function (res) {
                //console.log(res);
                $scope.initiatedProjects = res;
                //return res;
                console.log($scope.initiatedProjects);
            },
            function (err) {
                console.log('error occured : ' + err);
            }
        );
        //edit initiated project.
        var editIproject = {};
        $scope.editIP = function (row) {
            var index = $scope.initiatedProjects.indexOf(row);
            editIproject = $scope.initiatedProjects[index];
            console.log(editIproject);
            //$scope.editIproject = editIproject;
            transfer.setter(editIproject);

        }
    })

    //*********************************************
    //tranfer function
    //*********************************************
    .service('transfer', function () {
        var trans = this;
        trans.TnS = {};
        trans.setter = function (taskArr) {
            trans.TnS = taskArr;
        }
        trans.getter = function () {
            return trans.TnS;
        }
        return trans;
    })






    //***********************************************
    //get clients service.
    //
    //***********************************************
    //service.
    .service('projects', function projects($http, $q) {
        var project = this;
        project.members = [];
        project.getAssignedProjects = function () {
            var defer = $q.defer();
            $http.get('/getClients')
                .success(function (res) {
                    defer.resolve(res);
                    project.members = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })

            return defer.promise;


        }
        return project;
    })
    //controller.
    // auto-complete=>projectInitiate.html
    .controller('initiateCtrl', function ($timeout, $scope, $window, $http, $q, $log, $mdDialog, $mdMedia, projects) {
        var self = this;
        //var project;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states = projects.getAssignedProjects().then(
            function (res) {
                console.log(res);
                return res.split(/, +/g).map(function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state

                    };

                });
            },
            function (err) {
                console.log('hi');
            });

        /*
         //set client name
         var cn = $('#clientname').val();
         transfer.setterA(cn);
         //console.log(cn);
         */

        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.newState = newState;
        // self.selectProject =selectProject;
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

    //**********************************************************
    //controller of get members having priviledge to add Members.
    //projectInitiate.html
    //**********************************************************
    //service.
    .service('projectsx', function projects($http, $q) {
        var project = this;
        project.members = [];
        project.getAssignedProjects = function () {
            var defer = $q.defer();
            $http.get('/getMemberAdders')
                .success(function (res) {
                    defer.resolve(res);
                    project.members = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })

            return defer.promise;


        }
        return project;
    })
    //controller.
    // auto-complete=>projectInitiate.html
    .controller('addMembersCtrl', function ($timeout, $scope, $window, $http, $q, $log, $mdDialog, $mdMedia, projectsx) {
        var self = this;
        //var project;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states = projectsx.getAssignedProjects().then(
            function (res) {
                //console.log(res);
                return res.split(/, +/g).map(function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state

                    };

                });
            },
            function (err) {
                console.log('hi');
            });

        //set memberAddername.
        //var ma = $('#memAddName').val();
        //transfer.setterB(ma);

        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.newState = newState;
        // self.selectProject =selectProject;
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

    //***********************************************
    //controller of initiate project view page.
    //projectInitiate.html
    //***********************************************
    /**/
    //controller
    .controller('projectInitiateCtrl', function ($scope, $http,$window, transfer) {
        //Date picker
        $scope.myDate = new Date();
        $scope.minDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() - 2,
            $scope.myDate.getDate());
        $scope.maxDate = new Date(
            $scope.myDate.getFullYear(),
            $scope.myDate.getMonth() + 2,
            $scope.myDate.getDate());
        $scope.onlyWeekendsPredicate = function (date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        }

        $scope.dateFormat = function (date) {
            var m = date.getMonth();
            m = m + 1;
            return date.getFullYear() + "-" + m + "-" + date.getDate();
        }

        //pahugiya dates ba.
        $scope.minDate = new Date();

        //get from editInitiatedProjects.
        $scope.editIproject=transfer.getter();

        //send initiate project details to table.
        $scope.addInititateProject = function () {
            //console.log("hi");
            var name, description, bFunctions, deadline, clientName, memberAdderName;
            name = $scope.projectName;
            description = $scope.description;
            bFunctions = $scope.businessFunctions;
            deadline = $scope.dateFormat($scope.deadline);
            //clientName = transfer.getterA();
            clientName = $('#clientname').val();
            //memberAdderName = transfer.getterB();
            memberAdderName = $('#memAddName').val();
            var initiatedProject = {
                'name': name, 'description': description, 'businessFunctions': bFunctions,
                'deadline': deadline, 'client': clientName, 'memberAdder': memberAdderName
            };
            console.log(initiatedProject);
            if (clientName == "" && memberAdderName == "") {
                alert("All fields should filled to Submit")
            }
            else {
                //sent to DB.
                $http({
                    method: 'POST',
                    url: '/saveInitiatedDetails',
                    data: initiatedProject,  // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (data, status) {
                        //clearing input fields.
                        if(data==null) {
                            $scope.clearFields();
                            $window.location.reload();
                        }else{
                            alert(data);
                            $scope.clearFields();
                        }

                    })
                    .error(function(data,error){
                    })
            }
        }

        //clear button function.
        $scope.clearFields = function () {
            $scope.projectName = null;
            $scope.description = null;
            $scope.businessFunctions = null;
            $scope.deadline = "Enter Date";
            $scope.memberAdder = "";
            $scope.client = "";
            $scope.initiateForm.$setUntouched();
        }

        //delete initiated projects.
        $scope.Delete=function(){
            var deleteIP = {};
            deleteIP.pid=$scope.editIproject.pid;
            console.log(deleteIP);
            if($scope.editIproject.status=="Initiated") {
                //sent to DB.
                $http({
                    method: 'POST',
                    url: '/deleteInitiatedDetails',
                    data: deleteIP,  // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function (data, status) {
                        //$window.location.href = 'View initiated projects';
                        if (status != 200) {
                            alert("Error - check email added")
                        }
                    })
            }else{
                alert("This project is allready started. Cannot edit or delete.")
            }
        }

        //edit initiated projects.
        var editedIP={};
        $scope.edit=function() {
            editedIP.pid = $scope.editIproject.pid;
            editedIP.pname = $scope.editIproject.pname;
            editedIP.description = $scope.editIproject.description;
            editedIP.bfunctions = $scope.editIproject.bfunctions;
            var end = $scope.datex;
            //editedIP.end_date = $scope.dateFormat($scope.datex);
            var client = $('#clientname').val();
            var adder = $('#memAddName').val();
            if(client=="") {
                editedIP.client_mid = $scope.editIproject.client_mid;
            }
            else{
                editedIP.client_mid = client;
            }
            if (adder==""){
                editedIP.project_manager_mid = $scope.editIproject.project_manager_mid;
            }
            else{
                editedIP.project_manager_mid = adder;
            }
            if(end==null){
                editedIP.end_date = $scope.editIproject.end_date;
            }
            else{
                editedIP.end_date = $scope.dateFormat(end);
            }
            console.log(editedIP);
            //sent to DB.
            $http({
                method: 'POST',
                url: '/editInitiatedDetails',
                data: editedIP,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    //redirect to table page.
                    alert(data);
                    if (status != 200) {
                        alert("Error - check email added")
                    }
                })
        }
    })

    .config(function ($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    })








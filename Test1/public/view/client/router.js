angular.module('MyAppClient', ['ngMaterial', 'ngMessages', 'ui.router', 'smart-table', 'ng-fusioncharts','ui.bootstrap'])

    .config(function ($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise();
        $stateProvider
        // Client views =========================================================
            .state('cvp', {
                url: "/cvp",
                templateUrl: 'view/client/clientViewProject.html'
            })

            .state('View clients report', {
                url: "/report",
                templateUrl: "view/client/report.html"
            })

            //Initiator views ========================================================
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

            //senior manager views ===================================================
            .state('View project reports', {
                url: "/View project reports",
                templateUrl: 'view/seniorManager/ongoingProjects.html'
            })
            .state('View employee reports', {
                url: "/View employee reports",
                templateUrl: 'view/seniorManager/employeeReport.html'
            })

            //project manager views ========================================================
            .state('Add members and deliverables', {
                url: "/Add members and deliverables",
                templateUrl: 'view/projectManager/add_mem_n_del.html'
            })

            .state('View ongoing project details', {
                url: "/View ongoing project details",
                templateUrl: 'view/projectManager/view_del_n_tasks.html'
            })

            .state('View timesheets', {
                url: "/View timesheets",
                templateUrl: 'view/projectManager/view_timesheet.html'
            })

            .state('Edit members and deliverables', {
                url: "/Edit members and deliverables",
                templateUrl: 'view/projectManager/Edit_MembersnDeliverables.html'
            })
    })



    //*********************************************************************************
    // timeline JAVASCRIPT
    //*********************************************************************************

    .directive('timeline', function () {

        var ItemRangePopup = function (data, options) {
            links.Timeline.ItemRange.call(this, data, options);
        };

        ItemRangePopup.prototype = new links.Timeline.ItemRange();

        ItemRangePopup.prototype.updateDOM = function () {
            var divBox = this.dom;
            if (divBox) {

                divBox.className = "timeline-event timeline-event-range timeline-event-range-popup ui-widget ui-state-default";
                divBox.style.height = "22px";

                if (this.content) {
                    $(divBox).tooltip({
                        'placement': 'top',
                        'html': true,
                        'title': this.content,
                        'container': 'body'
                    });
                }

                if (this.isCluster) {
                    links.Timeline.addClassName(divBox, 'timeline-event-cluster ui-widget-header');
                }

                if (this.className) {
                    links.Timeline.addClassName(divBox, this.className);
                }
            }
        };

        return {
            restrict: 'A',
            scope: {
                model: '=timeline',
                options: '=timelineOptions',
                selection: '=timelineSelection',
                fullRange: '=timelinefullRangeUpdate',
                timeline: '=timelineCtrl'
            },
            link: function ($scope, $element) {
                var timeline = new links.Timeline($element[0]);
                timeline.addItemType('range-popup', ItemRangePopup);

                $scope.timeline = timeline;

                links.events.addListener(timeline, 'select', function () {
                    $scope.selection = undefined;
                    var sel = timeline.getSelection();
                    if (sel[0]) {
                        $scope.$apply(function () {
                            $scope.selection = $scope.model[sel[0].row];
                        })
                    }
                });

                $scope.$watch('model', function (newVal, oldVal) {
                    timeline.setData(newVal);
                    if ($scope.fullRange) {
                        timeline.setVisibleChartRangeAuto();
                    }
                }, true);

                $scope.$watch('options', function (newVal, oldVal) {
                    timeline.draw($scope.model, $scope.options);
                }, true);

                $scope.$watch('selection', function (newVal, oldVal) {
                    if (!angular.equals(newVal, oldVal)) {
                        for (var i = $scope.model.length - 1; i >= 0; i--) {
                            if (angular.equals($scope.model[i], newVal)) {
                                timeline.setSelection([{
                                    row: i
                                }]);
                                break;
                            }
                        }
                        ;
                    }
                });
            }
        };
    })



    // *********************************************
    // service to get projects assigned to client.
    //used by DemoCtrl
    // *********************************************
    //service.
    .service('roles', function projects($http, $q) {
        var role = this; //role is the service name.
        role.categories = [];
        //method to fill category names for auto-complete.
        role.getAddedCategories = function () {
            var defer = $q.defer();
            $http.get('/getClientProjects')
                .success(function (res) {
                    defer.resolve(res);
                    role.categories = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })
            return defer.promise;
        }
        return role; //return service here.
    })


    // *********************************************
    // controller of auto complete goes from here.
    // *********************************************
    .controller('DemoCtrl', function ($timeout, $scope, $window, $http, $q, $log, $mdDialog, $mdMedia, roles) {
        //set data from service to auto complete.
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
                console.log('could not fetch role names.');
            });

        // list of `state` value/display objects
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
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

        //auto complete functions over.

        //get project Details.
        var comP;
        var ongP;
        $scope.getProjectDetails = function () {
            pname = $('#projectName').val();
            //console.log(pname);
            var project = {};
            project.name = pname;
            $http({
                method: 'POST',
                url: '/getProjectDetails',
                data: project,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    console.log(data);
                    $scope.name = data.name;
                    $scope.end = data.end;
                    $scope.start = data.start;
                    $scope.duration = data.duration;
                    $scope.timeTill = data.timeTill;
                    $scope.cost = data.cost;
                    $scope.desc = data.desc;
                    $scope.pc = data.pc;
                    $scope.completeTasks = data.com;
                    $scope.ongoingTasks = data.ong;
                    com = data.com.length;
                    ong = data.ong.length;
                    //$scope.comP=((com/(com+ong))*100);
                    //$scope.ongP=((ong/(com+ong))*100);
                    //fushion pie chart.
                    var arrEdata = {
                        "chart": {
                            "caption": "Overall Progress",
                            "paletteColors": "#00059f,#0229bf,#2c2cff,#4e91fd,#68a7ca,#bac2ff",
                            "bgColor": "#ffffff",
                            "showBorder": "0",
                            "use3DLighting": "0",
                            "showShadow": "0",
                            "enableSmartLabels": "0",
                            "startingAngle": "0",
                            "showPercentValues": "1",
                            "showPercentInTooltip": "0",
                            "decimals": "1",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "toolTipColor": "#ffffff",
                            "toolTipBorderThickness": "0",
                            "toolTipBgColor": "#000000",
                            "toolTipBgAlpha": "80",
                            "toolTipBorderRadius": "2",
                            "toolTipPadding": "5",
                            "showHoverEffect": "1",
                            "showLegend": "1",
                            "legendBgColor": "#ffffff",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#666666",
                            "useDataPlotColorForLabels": "1",

                        }
                    };

                    $scope.arrEdata = arrEdata;

                    var actualEData = [
                        {"Type": "Completed", "val": com},
                        {"Type": "Incomplete", "val": ong}
                    ];

                    $scope.actualEdata = actualEData;
                    $scope.arrEdata['data'] = [];

                    for (var i = 0; i < actualEData.length; i++) {

                        $scope.arrEdata.data.push({label: actualEData[i].Type, value: actualEData[i].val});
                    }


                    var pieEmp = angular.toJson(arrEdata);
                    $scope.pieEmp = pieEmp;

                    console.log($scope.pieEmp);
                })
                .error(function () {
                    alert("This project is still not setup")
                })
        }


    })
























    //*************************************************************************************************************
    //*************************************************************************************************************
    //Initiator App -> appInitiator.
    //*************************************************************************************************************
    //*************************************************************************************************************

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
    .controller("viewInCtrl", function ($scope, $window, iniPro, transfer) {
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
    .controller('projectInitiateCtrl', function ($scope, $http, $window, transfer) {
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
        $scope.editIproject = transfer.getter();

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
                        if (data == null) {
                            $scope.clearFields();
                            $window.location.reload();
                        } else {
                            alert(data);
                            $scope.clearFields();
                        }

                    })
                    .error(function (data, error) {
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
        $scope.Delete = function () {
            var deleteIP = {};
            deleteIP.pid = $scope.editIproject.pid;
            console.log(deleteIP);
            if ($scope.editIproject.status == "Initiated") {
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
            } else {
                alert("This project is allready started. Cannot edit or delete.")
            }
        }

        //edit initiated projects.
        var editedIP = {};
        $scope.edit = function () {
            editedIP.pid = $scope.editIproject.pid;
            editedIP.pname = $scope.editIproject.pname;
            editedIP.description = $scope.editIproject.description;
            editedIP.bfunctions = $scope.editIproject.bfunctions;
            var end = $scope.datex;
            //editedIP.end_date = $scope.dateFormat($scope.datex);
            var client = $('#clientname').val();
            var adder = $('#memAddName').val();
            if (client == "") {
                editedIP.client_mid = $scope.editIproject.client_mid;
            }
            else {
                editedIP.client_mid = client;
            }
            if (adder == "") {
                editedIP.project_manager_mid = $scope.editIproject.project_manager_mid;
            }
            else {
                editedIP.project_manager_mid = adder;
            }
            if (end == null) {
                editedIP.end_date = $scope.editIproject.end_date;
            }
            else {
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







































    //**********************************************************************************************
    //**********************************************************************************************
    //senior Manager App ->
    //**********************************************************************************************
    //**********************************************************************************************

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////service to get initiated projects////////////////

    .service('projectRuwi', function projects($http, $q) {
        var project = this;
        project.members = [];
        project.EmpMembers = [];
        project.projNames = [];
        project.getAssignedProjects = function () {
            var defer = $q.defer();
            $http.get('/initiatedProjects')
                .success(function (res) {
                    defer.resolve(res);
                    project.members = res.data;

                })
                .error(function (err, status) {
                    defer.reject(err);
                })

            return defer.promise;


        }
        project.getMembers = function () {
            var defer = $q.defer();
            $http.get('/memberReports')
                .success(function (res) {
                    defer.resolve(res);
                    project.EmpMembers = res.data;
                })
                .error(function (err, status) {
                    defer.reject(err);
                })

            return defer.promise;


        }
        project.getDeliverables = function () {
            var defer = $q.defer();
            $http.get('/getDeliverables')
                .success(function (res) {
                    defer.resolve(res);
                })
                .error(function (err, status) {
                    defer.reject(err);
                })

            return defer.promise;
        }
        return project;
    })


    /////////////////////////////////////
    ///////////////////////////////
    ///////////autocomplete for selecting projects for employee report for SM
    ////////////////////////////////////////////

    .controller('SelectProjectForEmployeeReport', function ($timeout, $scope, $http, $q, $log, projectRuwi) {
        ///////*$http shud be injected before $q


        var self = this;
        var project;
        /* var Complete;
         var incompleted;
         var ExtCompleted ;
         var ExtInCompleted;*/

        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        // Name=nameTransfer.getProjectName; console.log(Name);
        //  self.states        = Name;


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
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.ProjDataForEmp = function () {
            project = $('#projectName').val();
            var ProjectName = {'name': project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/viewMemberReports-Project',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                console.log(data);
                $scope.EData = data;
                console.log($scope.EData);
                // $scope.EmReportVisible=true; //make report visible
                $scope.EmpComplete = $scope.EData.completed;
                $scope.EmpIncomplete = $scope.EData.incomplete;
                $scope.EmpExtComplete = $scope.EData.ExtComplete;
                $scope.EmpExtIncomplete = $scope.EData.ExtInComplete;
                $scope.EmpOverdue = $scope.EData.Overdue;
                $scope.EmpSubmitted = $scope.EData.Submitted;


                $scope.ComProj = $scope.EData.CompProj;
                $scope.OngProj = $scope.EData.OngProj;

                var arrEdata = {
                    "chart": {
                        "caption": "Overall Progress",
                        "paletteColors": "#00059f,#0229bf,#2c2cff,#4e91fd,#68a7ca,#bac2ff",
                        "bgColor": "#ffffff",
                        "showBorder": "0",
                        "use3DLighting": "0",
                        "showShadow": "0",
                        "enableSmartLabels": "0",
                        "startingAngle": "0",
                        "showPercentValues": "1",
                        "showPercentInTooltip": "0",
                        "decimals": "1",
                        "captionFontSize": "14",
                        "subcaptionFontSize": "14",
                        "subcaptionFontBold": "0",
                        "toolTipColor": "#ffffff",
                        "toolTipBorderThickness": "0",
                        "toolTipBgColor": "#000000",
                        "toolTipBgAlpha": "80",
                        "toolTipBorderRadius": "2",
                        "toolTipPadding": "5",
                        "showHoverEffect": "1",
                        "showLegend": "1",
                        "legendBgColor": "#ffffff",
                        "legendBorderAlpha": "0",
                        "legendShadow": "0",
                        "legendItemFontSize": "10",
                        "legendItemFontColor": "#666666",
                        "useDataPlotColorForLabels": "1",

                    }
                };

                $scope.arrEdata = arrEdata;

                var actualEData = [
                    {"Type": "Completed", "val": $scope.EmpComplete},
                    {"Type": "Incomplete", "val": $scope.EmpIncomplete},
                    {"Type": "Extended(Completed)", "val": $scope.EmpExtComplete},
                    {"Type": "Extended(Incomplete)", "val": $scope.EmpExtIncomplete},
                    {"Type": "Overdue", "val": $scope.EmpOverdue},
                    {"Type": "Submitted", "val": $scope.EmpSubmitted}
                ];

                $scope.actualEdata = actualEData;
                $scope.arrEdata['data'] = [];

                for (var i = 0; i < actualEData.length; i++) {

                    $scope.arrEdata.data.push({label: actualEData[i].Type, value: actualEData[i].val});
                }


                var pieEmp = angular.toJson(arrEdata);
                $scope.pieEmp = pieEmp;

                console.log($scope.pieEmp);


                ////////////
                ////completed projects
                ///////


            });
        }


    })



    ///////////////////////////////////////
    ////////// employee reports for Senior manager
    ////////////////////////////////////////////////////////
    .controller('EmpReport', function ($timeout, $scope, $http, $q, $log, projectRuwi) {
        ///////*$http shud be injected before $q


        var self = this;
        var project;
        /* var Complete;
         var incompleted;
         var ExtCompleted ;
         var ExtInCompleted;*/

        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states = projectRuwi.getMembers().then(
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
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.employeeData = function () {
            project = $('#projectName').val();
            var ProjectName = {'name': project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/viewMemberReports',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                console.log(data);
                $scope.EData = data;
                $scope.pName = $scope.EData.projects;
                console.log($scope.pName);
                //nameTransfer.setProjectName( $scope.pName);
                //console.log($scope.EData);
                $scope.EmReportVisible = true; //make report visible

                $scope.category = $scope.EData.category;
                $scope.EmpComplete = $scope.EData.completed;
                $scope.EmpIncomplete = $scope.EData.incomplete;
                $scope.EmpExtComplete = $scope.EData.ExtComplete;
                $scope.EmpExtIncomplete = $scope.EData.ExtInComplete;
                $scope.EmpOverdue = $scope.EData.Overdue;
                $scope.EmpSubmitted = $scope.EData.Submitted;


                /*              console.log( $scope.EmpComplete);
                 console.log( $scope.EmpIncomplete);
                 console.log( $scope.EmpExtComplete);
                 console.log( $scope.EmpExtIncomplete);
                 console.log( $scope.EmpOverdue);
                 console.log( $scope.EmpSubmitted);*/
                /* var _selected;

                 $scope.selected = undefined;
                 $scope.states = $scope.pName;*/

                $scope.ComProj = $scope.EData.CompProj;
                $scope.OngProj = $scope.EData.OngProj;

                var arrEdata = {
                    "chart": {
                        "xAxisname": "Employee",
                        "yAxisName": "Progress(Number of Tasks)",
                        "paletteColors": "#00059f,#0229bf,#2c2cff,#4e91fd,#68a7ca,#bac2ff",
                        "bgColor": "#ffffff",
                        "borderAlpha": "20",
                        "showCanvasBorder": "0",
                        "usePlotGradientColor": "0",
                        "plotBorderAlpha": "10",
                        "legendBorderAlpha": "0",
                        "legendShadow": "0",
                        "valueFontColor": "#ffffff",
                        "showXAxisLine": "1",
                        "xAxisLineColor": "#999999",
                        "divlineColor": "#999999",
                        "divLineDashed": "1",
                        "showAlternateHGridColor": "0",
                        "subcaptionFontBold": "0",
                        "subcaptionFontSize": "14",
                        "showHoverEffect": "1"

                    }
                };

                $scope.arrEdata = arrEdata;
                   $scope.arrEdata.categories=[{"category":[ {"label":"Complete"},
                    {"label":"Ongoing"},
                    {"label":"Extended(complete)"},
                    {"label":"Extended(Ongoing)"},
                    {"label":"Overdue"},
                    {"label":"Submitted"}
                ]}];

               $scope.arrEdata.dataset = [ {
                   "data":[{"value": $scope.EmpComplete},
                           {"value": $scope.EmpIncomplete},
                           {"value": $scope.EmpExtComplete},
                           {"value": $scope.EmpExtIncomplete},
                           {"value": $scope.EmpOverdue},
                           {"value": $scope.EmpSubmitted }]

               }];



                var pieEmp = angular.toJson(arrEdata);
                $scope.pieEmp = pieEmp;

                console.log($scope.pieEmp);



            });
        }

        //get projects assigned to member.
        //boostrap typer head.
        $scope.selec = undefined;

        $scope.stats = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
            'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
            'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
            'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
            'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        // Any function returning a promise object can be used to load values asynchronously
        //$scope.stats=data.projectNames; // get task assigned, completed projects of member assigned.

    })
    /////////////////////////////////////////////////////////////////////////
    /////////////////////autocomplete controller////////////////////////////


    .controller('Auto', function ($timeout, $scope, $http, $q, $log, projectRuwi) {
        ///////*$http shud be injected before $q


        var self = this;
        var project;

        self.simulateQuery = false;
        self.isDisabled = false;

        self.states = projectRuwi.getAssignedProjects().then(
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

       /* $scope.selectProject = function () {
            project = $('#projectName').val();
            var ProjectName = {'name': project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/assignedprojects',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                $scope.pjt = data;
                console.log(data);
            });
        }*/
        $scope.ongoingProjects = function () {
            project = $('#projectName').val();
            var ProjectName = {'name': project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/ongoingProjects',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                console.log(data);
                $scope.pjtdetails = data;

                $scope.p = $scope.pjtdetails.ProjectName;
                console.log($scope.p);
                $scope.dels = $scope.pjtdetails.Deliverables;
                $scope.tasks = $scope.pjtdetails.Tasks;
                console.log($scope.tasks);
                $scope.subtasks = $scope.pjtdetails.Subtasks;
                console.log($scope.subtasks);

                $scope.chachcha = true;


                $scope.Complete = $scope.pjtdetails.completed;
                $scope.Incompleted = $scope.pjtdetails.incomplete;
                $scope.ExtCompleted = $scope.pjtdetails.ExtComplete;
                $scope.ExtInCompleted = $scope.pjtdetails.ExtInComplete;
                $scope.Overdue = $scope.pjtdetails.Overdue;
                $scope.Submitted = $scope.pjtdetails.Submitted;

                $scope.EmpProgress = $scope.pjtdetails.Progress;

                var arrData = {
                    "chart": {

                        "xAxisname": "Employee",
                        "yAxisName": "Progress(Number of Tasks)",
                        "paletteColors": "#00059f,#0229bf,#2c2cff,#4e91fd,#68a7ca,#bac2ff",
                        "bgColor": "#ffffff",
                        "borderAlpha": "20",
                        "showCanvasBorder": "0",
                        "usePlotGradientColor": "0",
                        "plotBorderAlpha": "10",
                        "legendBorderAlpha": "0",
                        "legendShadow": "0",
                        "valueFontColor": "#ffffff",
                        "showXAxisLine": "1",
                        "xAxisLineColor": "#999999",
                        "divlineColor": "#999999",
                        "divLineDashed": "1",
                        "showAlternateHGridColor": "0",
                        "subcaptionFontBold": "0",
                        "subcaptionFontSize": "14",
                        "showHoverEffect": "1"

                    }
                };

                $scope.arrData = arrData;

                $scope.arrData.categories=[{"category":[ {"label":"Complete"},
                    {"label":"Ongoing"},
                    {"label":"Extended(complete)"},
                    {"label":"Extended(Ongoing)"},
                    {"label":"Overdue"},
                    {"label":"Submitted"}
                ]}];

                $scope.arrData.dataset = [ {
                    "data":[{"value": $scope.Complete},
                        {"value": $scope.Incompleted},
                        {"value": $scope.ExtCompleted},
                        {"value": $scope.ExtInCompleted},
                        {"value": $scope.Overdue},
                        {"value": $scope.Submitted }]

                }];

                var jsonEncodedData = angular.toJson(arrData);
                $scope.jsonEncodedData = jsonEncodedData;
                // console.log(jsonEncodedData);


                //////
                //employee data
                /////////

                var arrEmpData = {
                    "chart": {
                        "subCaption": "",
                        "xAxisname": "Employee",
                        "yAxisName": "Progress(Number of Tasks)",
                        "paletteColors": "#00059f,#0229bf,#2c2cff,#4e91fd,#68a7ca,#bac2ff",
                        "bgColor": "#ffffff",
                        "borderAlpha": "20",
                        "showCanvasBorder": "0",
                        "usePlotGradientColor": "0",
                        "plotBorderAlpha": "10",
                        "legendBorderAlpha": "0",
                        "legendShadow": "0",
                        "valueFontColor": "#ffffff",
                        "showXAxisLine": "1",
                        "xAxisLineColor": "#999999",
                        "divlineColor": "#999999",
                        "divLineDashed": "1",
                        "showAlternateHGridColor": "0",
                        "subcaptionFontBold": "0",
                        "subcaptionFontSize": "14",
                        "showHoverEffect": "1"
                    }
                };

                $scope.arrEmpData = arrEmpData;
                $scope.arrEmpData.categories = [];
                console.log(arrEmpData);
                //$scope.arrEmpData.categories['category'] = {};
                $scope.arrEmpData.dataset = [];

                $scope.category = [];


                //var datac = [];
                $scope.dataC = [];
                //var dataI = [];
                $scope.dataI = [];
                //var dataEC = [];
                $scope.dataEC = [];
                // var dataEI = [];
                $scope.dataEI = [];
                // var dataO = [];
                $scope.dataO = [];
                // var dataS = [];
                $scope.dataS = [];

                console.log(arrEmpData);

                for (var i = 0; i < $scope.EmpProgress.length; i++) {

                    $scope.category.push({"label": $scope.EmpProgress[i].EmployeeName});


                    $scope.dataC.push({"value": $scope.EmpProgress[i].completed});
                    $scope.dataI.push({"value": $scope.EmpProgress[i].incomplete});
                    $scope.dataEC.push({"value": $scope.EmpProgress[i].ExtComplete});
                    $scope.dataEI.push({"value": $scope.EmpProgress[i].ExtInComplete});
                    $scope.dataO.push({"value": $scope.EmpProgress[i].Overdue});
                    $scope.dataS.push({"value": $scope.EmpProgress[i].Submitted});
                }


                //  console.log($scope.arrEmpData.categories);
                $scope.arrEmpData.categories.push({'category': $scope.category});


                $scope.arrEmpData.dataset = [
                    {
                        "seriesname": "Completed",
                        "data": $scope.dataC
                    },
                    {
                        "seriesname": "Incomplete",
                        "data": $scope.dataI
                    },
                    {
                        "seriesname": "Extended(Complete)",
                        "data": $scope.dataEC
                    },
                    {
                        "seriesname": "Extended(Incomplete)",
                        "data": $scope.dataEI
                    },
                    {
                        "seriesname": "Overdue",
                        "data": $scope.dataO
                    },
                    {
                        "seriesname": "Submitted",
                        "data": $scope.dataS
                    }

                ];


                // console.log(arrEmpData);

                var EmpData = angular.toJson(arrEmpData);
                $scope.EmpData = EmpData;

                console.log(EmpData);

            });
        }
    })

























    //**********************************************************************************************
    //**********************************************************************************************
    //project Manager App ->
    //**********************************************************************************************
    //**********************************************************************************************


    /////////////////////////////////////////////////////////////////////////
    ///////////////////////service to get initiated projects////////////////

    .service('projectsSachi', function projects($http, $q, transfer){
        var project = this;
        project.projects = [];
        project.members =[];
        project.addedData = [];
        project.getOngoing = [];
        project.categories = [];
        ///status 0
        project.getAssignedProjects = function(){
            var defer = $q.defer();
            $http.get('/initiatedProjects')
                .success(function(res){
                    defer.resolve(res);
                    project.projects=res.data;

                })
                .error(function(err,status){
                    defer.reject(err);
                })

            return defer.promise;


        }
        //get project where status 1
        project.editOngoingProjects = function(){
            var defer = $q.defer();
            $http.get('/getProjectsToEdit')
                .success(function(res){
                    defer.resolve(res);
                    project.addedData = res.data;
                })
                .error(function(err,status){
                    defer.reject(err);
                })
            return defer.promise;
        }
        //get projects where status 2
        project.getOngoingProjects = function(){
            var defer = $q.defer();
            $http.get('/getProjectsToDisplay')
                .success(function(res){
                    defer.resolve(res);
                    project.getOngoing = res.data;
                })
                .error(function(err,status){
                    defer.reject(err);
                })
            return defer.promise;
        }
        project.getCategories = function(){
            var defer = $q.defer();
            $http.get('/getCategories')
                .success(function(res){
                    defer.resolve(res);
                    project.categories = res.data;

                })
                .error(function(err,status){
                    defer.reject(err);
                })

            return defer.promise;


        }
        project.getTaskassignRoles = function(){
            var defer = $q.defer();
            $http.get('/getTaskassignCat')
                .success(function(res){
                    defer.resolve(res);
                    project.categories = res.data;

                })
                .error(function(err,status){
                    defer.reject(err);
                })

            return defer.promise;


        }



        project.getMembers = function(){
            var defer = $q.defer();
            $http.get('/getMembers')
                .success(function(res){
                    defer.resolve(res);
                    project.members = res.data;

                })
                .error(function(err,status){
                    defer.reject(err);
                })

            return defer.promise;
        }


        return project;
    })

    ///////////////////////////////////////////////////////////////////
    /////////////////service to transfer tasks n subtasks to sidenav controlller//////

    .service('transferSachi',function(){
        var trans = this;
        trans.TnS = {};
        trans.PN = {};
        trans.mem = {};
        trans.D = {};
        trans.projectdetails={};

        trans.addTasks = function(taskArr){
            trans.TnS.tasks = taskArr;

        };
        trans.getTasks = function(){
            return trans.TnS;
        }
        trans.getProject = function(Project){
            trans.PN.name = Project;
        }

        trans.setProject = function(){
            return trans.PN.name;
        }
//////**************************************************
        trans.setMembers=function(mem){
            trans.projectdetails.members = mem;
        }
        trans.getMembers=function(){
            return  trans.projectdetails.members;
        }
        trans.setTaskAssignee = function(name){
            trans.projectdetails.TA = name;
        }
        trans.getTaskAssignee = function(){
            return  trans.projectdetails.TA;
        }
        trans.setDeliverables = function(del){
            trans.projectdetails.Del = del;
        }
        trans.getDeliverables = function(){
            return trans.projectdetails.Del;
        }
///////////***********************************************
        trans.getDeadline = function(Deadline){
            trans.D.deadline = Deadline;
        }
        trans.setDeadline = function(){
            return trans.D.deadline;
        }

        return trans;

    })





    ////////////////////////////////////////////////////////////////
    ///////////add mems n dels//////////////////////////////////////
    .controller('members',function($scope, $http,transferSachi,projectsSachi ){
        $scope.data = [];
        var members = [];
        $scope.deliverables = [];
        var D = [];
        var TA;
        var pid = transferSachi.setProject();
        //$scope.MemsnDels = {'pid':pid,'deliverables':D,'members':Members,'TaskAssignee':TA};




        ///////////////////get all categories with privilege of view assigned tasks-
        //            for bootstrap type head in add mems n dels///////////
        $scope.category = undefined;
        $scope.member  = undefined;

        projectsSachi.getCategories().then(
            function(res){
                $scope.states=res;
                console.log(res);
            }
        );
        //////////////////////get categories with privilge to assign tasks////////////////////////
        $scope.assignTask = undefined;
        $scope.TaskMember = undefined;

        projectsSachi.getTaskassignRoles().then(
            function(res){
                $scope.assignTasks= res;
                console.log(res);
            }
        )

        ///////////////////get members with assign task  privilge/////////////////////////
        $scope.getTaskAssignee = function(){
            console.log($scope.assignTask);
            $http({
                method: 'POST',
                url: '/getMembers',
                data: {'category':$scope.assignTask} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                $scope.taskMem = data;
                console.log($scope.taskMem);
            });
        }

        //////////////////get members with the view assigned tasks - bootstrap typehead in add mems n del/////////
        $scope.getMembers = function(){
            console.log($scope.category);
            $http({
                method: 'POST',
                url: '/getMembers',
                data: {'category':$scope.category} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                $scope.members = data;
                console.log($scope.members);
            });
        };

        //////////////////////add member(developer) to project /////////////////////////////////////
        $scope.addMembers = function(){
            for( var i =0;i<members.length;i++)
            {
                if(members[i].name == $scope.member)
                {
                    var exist = true;
                    $scope.member = [];
                    $scope.category = [];
                }
            }
            if(!exist)
            {
                if($scope.member != undefined ||$scope.member!= null )
                {
                    var mem = $scope.member;
                    var m = {};
                    m.name = mem;
                    members.push(m);
                    transferSachi.setMembers(members);
                    $scope.data.push({'name': $scope.member, 'cat': $scope.category})
                    $scope.member = undefined;
                    $scope.category = undefined;
                    console.log(members);
                }
            }
        };

        ////////////////////////add member to assign tasks for project
        $scope.addTaskAssignee = function()
        {
            $scope.assignor = {};
            if($scope.TaskMember  != undefined || $scope.TaskMember != [])
            {
                TA = $scope.TaskMember;
                cat = $scope.assignTask;
                $scope.assignor.name = TA;
                $scope.assignor.cat = cat;
                console.log(TA);
                transferSachi.setTaskAssignee(TA);
                $scope.TaskMember = undefined;
                $scope.assignTask = undefined;
            }

        };

        ///////////////validate add member to assign task/////////////
        $scope.ValTaskAssignee = function()
        {
            if($scope.TaskMember == undefined || $scope.TaskMember== [])
                return true;
        };

        //////////validate add memebers to project button//////////
        $scope.ValAddMem = function()
        {
            if($scope.member == undefined || $scope.member==null)
            {
                return true;
            }
        };

        ////////////////////////validate get task assignees///////////
        $scope.ValGetTA = function()
        {
            if($scope.assignTask == undefined || $scope.assignTask==null)
            {
                return true;
            }
        };

        //////////////////validate get developer names////////////
        $scope.ValGetMem = function()
        {
            if($scope.category == undefined || $scope.category==null)
            {
                return true;
            }
        };

        ////////////validate add deliverable button////////////////
        $scope.ValAddDel = function()
        {
            if( $scope.deadline == null && $scope.delName == null)
            {
                return true;
            }
        };

        $scope.dateFormat =function(date){
            var  m = date.getMonth();
            m=m+1;
            return date.getFullYear()+"-"+ m + "-" + date.getDate();
        };

        var myDate = new Date();
        $scope.mindate = myDate ;
        console.log(myDate);


        $scope.saveDeliverables =  function()
        {
            var pid = transferSachi.setProject();
            var d= $scope.dateFormat($scope.deadline);
            for( var i =0;i<D.length;i++)
            {
                if(D[i].name == $scope.delName)
                {
                    var exist = true;
                    $scope.delName = null;
                    $scope.deadline = null;
                }

            }
            if(!exist)
            {
                var DN = $scope.delName;
                var del = {};
                del.name = DN;
                del.deadline = d;

                D.push(del);
                transferSachi.setDeliverables(D);
                $scope.deliverables.push({'name': $scope.delName, 'deadline': d})
                $scope.delName = null;
                $scope.deadline = null;

                console.log(D);
            }


        };

        ////////////validate submit members n deliverables button///////
        $scope.ValSubmit = function ()
        {
            if($scope.ValTaskAssignee() == true &&  $scope.ValAddMem() == true &&  $scope.ValAddDel() == true)
            {
                return true;
            }
        }





        //////////////////////////////saving deliverables and memebers///////////

        $scope.addMembersAndDeliverables = function()
        {
            $scope.MemsnDels={};
            var p = transferSachi.setProject();
            $scope.MemsnDels.pid = p;
            $scope.MemsnDels.TaskAssignee = transferSachi.getTaskAssignee();
            $scope.MemsnDels.dels = transferSachi.getDeliverables();
            $scope.MemsnDels.mems = transferSachi.getMembers();
            // var MemsnDels = {'pid':pid,'deliverables':D,'members':members,'TaskAssignee':TA};

            console.log( $scope.MemsnDels);
            if($scope.MemsnDels.pid  == null  )
            {
                window.alert('please select a project');

            }
            if( $scope.MemsnDels.TaskAssignee == null)
            {
                window.alert('please select a task assignee');

            }
            if ( $scope.MemsnDels.dels== null)
            {
                window.alert('please add deliverables  for project');
            }
            if ( $scope.MemsnDels.mems ==null)
            {
                window.alert('please select members for project');
            }
            else
            {
                var MD = {'ProjectData':$scope.MemsnDels};
                $http({
                    method: 'POST',
                    url: '/addMembersDeliverables',
                    data:  MD,  // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

                }).success(function (data) {
                    var r =data;
                    console.log(r);
                });
            }
        };
    })



    ///////////////////////////////edit mems n dels/////////////////////////////////////////
    .controller('membersEdit',function($scope, $http,transferSachi,projectsSachi ){

        $scope.category = undefined;
        $scope.member = undefined;

        //////////////////////get categories with privilge to assign tasks////////////////////////
        $scope.assignTask = undefined;
        $scope.TaskMember = undefined;

        projectsSachi.getTaskassignRoles().then(
            function(res){
                $scope.assignTasks= res;
                console.log(res);
            }
        )

        ///////////////////get members with assign task  privilge/////////////////////////
        $scope.getTaskAssignee = function(){
            console.log($scope.assignTask);
            $http({
                method: 'POST',
                url: '/getMembers',
                data: {'category':$scope.assignTask} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                $scope.taskMem = data;
                console.log($scope.taskMem);
            });
        }


        ////////////////////////get categories for bootstrap typeahead in edit memes n dels
        projectsSachi.getCategories().then(
            function(res){
                $scope.states=res;
                console.log(res);
            }
        );
        //////////////////get members for category - bootstrap typehead in edit mems n del/////////
        $scope.getMembers = function(){
            console.log($scope.category);
            $http({
                method: 'POST',
                url: '/getMembers',
                data: {'category':$scope.category} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                $scope.members = data;
                console.log($scope.members);
            });
        };

        ////////////////////////add new member to project-edit_mems_n_dels
        $scope.addMembers = function(){
            var pid = transferSachi.setProject();

            $http({
                method: 'POST',
                url: '/addMembers',
                data: {'memname':$scope.member ,'Project':pid, 'category':$scope.category} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                var m = data;
                console.log(m);
                if(m == 0) {
                    $scope.addedMembers.push({'name': $scope.member, 'category': $scope.category})
                    window.alert("Members added to project");
                } else{
                    window.alert("Member exist");
                    $scope.member = [];
                    $scope.category = [];
                }
            });

        };
        //////////////change task assignor-edit mems n dels///////////
        $scope.addTaskAssignee = function()
        {
            var pid = transferSachi.setProject();
            $http({
                method: 'POST',
                url: '/addMemberToAssignTask',
                data: {'memname':$scope.TaskMember ,'Project':pid} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data)
            {
                $scope.AssignorName =  $scope.TaskMember;
                $scope.AssignCat = $scope.assignTask;
            })


        }

        ////////////////////get the member name to be deleted
        $scope.deleteMem = function(row){
            $scope.i = $scope.addedMembers.indexOf(row);
            console.log( $scope.i);
            $scope.memberTodelete = $scope.addedMembers[$scope.i].name;
        };



        ////////////////////delete member from project
        $scope.delete = function(){
            var pid = transferSachi.setProject();
            $http({
                method: 'POST',
                url: '/deleteMemberFromProject',
                data: {'memname': $scope.memberTodelete ,'Pid':pid} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(){
                window.alert("Member deleted from project")
                $scope.addedMembers.splice($scope.i,1);
            });

        }
    })


    //////////////////////////////////////////////////////////////
    //////////Add deliverables dyanmically/////////////////////
    .controller('MainCtrl', function($scope,$http,transferSachi,$mdDialog,$mdMedia,$mdSidenav) {

        $scope.dateFormat =function(date){
            var  m = date.getMonth();
            m=m+1;
            return date.getFullYear()+"-"+ m + "-" + date.getDate();
        };

        var myDate = new Date();
        $scope.mindate = myDate ;
        console.log(myDate);


        $scope.deliverables = [];


        //////////////////validation for datepicker-add mems n dels
        $scope.checkDel = function(){
            if($scope.deliverables.length == 0)
                return true;
        }
        $scope.saveDeliverables =  function(){
            var pid = transferSachi.setProject();

            var d= $scope.dateFormat($scope.deadline);
            console.log(pid);
              if(pid != null) {
                  $http({
                      method: 'POST',
                      url: '/addDeliverables',
                      data: {'deliverable': $scope.delName, 'PID': pid, 'deadline': d},
                      headers: {'Content-Type': 'application/json'}
                  }).success(function (data) {
                      //console.log(d);
                      var de = data;
                      console.log(de);
                      if (de == 1) {
                          $scope.deliverables.push({'name': $scope.delName, 'deadline': d})
                          $scope.delName = null;
                          $scope.deadline = null;
                      } else if (d == 0) {
                          window.alert("Deliverable exist");
                          $scope.delName = null;
                          $scope.deadline = null;
                      }
                  });
              }else
                 window.alert("Please select a project");

        };
        ////////////in edit mems n dels
        $scope.saveDel = function(){
            var pid = transferSachi.setProject();
            var d= $scope.dateFormat($scope.deadline);

            $http({
                method: 'POST',
                url: '/addDeliverables',
                data: {'deliverable':$scope.delName,'PID':pid,'deadline':d} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data){
                var r = data;
                console.log(d);
                if(r == 1) {
                    $scope.addedDeliverables.push({'del_name': $scope.delName, 'deadline': d})
                    $scope.delName = null;
                    $scope.deadline = null;
                }else
                    window.alert("Deliverable exist");
            });

        };

        $scope.selectDel  = function(row){
            $scope.i =  $scope.addedDeliverables.indexOf(row);
            var name = $scope.addedDeliverables[$scope.i].del_name;
        }

        $scope.deleteDel = function(row){
            var pr = transferSachi.setProject();
            $http({
                method: 'POST',
                url: '/deleteDeliverables',
                data: {'deliverable':name,'pid':pr} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(){
                window.alert("Deliverable removed from project");
                $scope.addedDeliverables.splice($scope.i,1);
            });
        }
//////////////////////////////////get del id for updating
        $scope.selectItem = function(row){
            $mdSidenav('right')
                .toggle();
            $scope.u =  $scope.addedDeliverables.indexOf(row);
            $scope.del = $scope.addedDeliverables[$scope.u].del_id;
        };

        $scope.close = function () {
            $mdSidenav('right').close();
        };

        $scope.update = function(){
            var deadline = $scope.dateFormat($scope.updatedDeadline);
            var pr = transferSachi.setProject();
            console.log(pr);
            $http({
                method: 'POST',
                url: '/updateDeliverables',
                data: {'deliverable':$scope.updatedName,'deadline':deadline,'Pid':pr,'Delid': $scope.del} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data) {
                var d = data;
                if (d == 1)
                {
                    window.alert("Deliverable updated in project")
                    $scope.addedDeliverables[$scope.u].del_name = $scope.updatedName;
                    $scope.addedDeliverables[$scope.u].deadline = deadline;
                    $scope.updatedName = null;
                    $scope.updatedDeadline = null;
                }else
                    window.alert("Deliverable exist");

            });
        }

    })







    /////////////////////////////////////////////////////////////////////////
    /////////////////////autocomplete controller- add_mems_n_dels////////////////////////////


    .controller('AddMemAndDel',function($timeout,$scope, $http,$q, $log,projectsSachi, transferSachi) {
        ///////*$http shud be injected before $q
        var self = this;
        var project;
        self.simulateQuery = false;
        self.isDisabled    = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states=projectsSachi.getAssignedProjects().then(
            function(res){
                console.log(res);
                return res.split(/, +/g).map( function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state

                    };

                });
            },
            function(err){
                console.log('hi');
            });

        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
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
        function querySearch (query) {
            var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
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


        $scope.selectProject=function (){

            project = $('#projectName').val();
            transferSachi.getProject(project);
            var ProjectName = {'name':project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/assignedprojects',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                var Project = data;
                console.log(Project);
                $scope.pjt = Project.ProjectDetails;
                $scope.client = Project.clientName;
                transferSachi.getProject($scope.pjt.pid);
                console.log($scope.pjt.pid);
                transferSachi.getDeadline($scope.pjt.end_date);
                var d = new Date($scope.pjt.end_date);
                $scope.maxdate=d;
            });
        };


        $scope.checkProject = function(){
            if($('#projectName').val()== ""){
                return true;
            }
        }

    })




    ////////////////////////////////////////////////////////////////////////////////////
    //autocomplete controller to select project for editing-edit_mems_n_dels//////////
    .controller('EditOngoing',function  ($timeout,$scope, $http,$q, $log,projectsSachi,transferSachi) {
        var self = this;
        var project;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states = projectsSachi.editOngoingProjects().then(
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




        $scope.selectOngoingProject = function(){
            project = $('#projectName').val();
            var ProjectName = {'name':project};

            $http({
                method: 'POST',
                url: '/editAddedMemsnDels',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                // transfer.setMembers($scope.addedMembers);

                $scope.MembersnDels = data;
                $scope.addedMembers = $scope.MembersnDels.WorkingMembers;
                $scope.addedDeliverables = $scope.MembersnDels.Deliverables;
                $scope.AssignorName =  $scope.MembersnDels.TaskAssignor;
                $scope.AssignCat =  $scope.MembersnDels.TaskAssignCat;
                console.log($scope.MembersnDels.Pdeadline);
                console.log($scope.addedMembers);
                transferSachi.getProject($scope.MembersnDels.Pid);
                var d = new Date($scope.MembersnDels.Pdeadline);
                $scope.maxdate=d;

            })

        }

    })
    //////////////////////////////////////////////////////////////////////
    /////////////////autocomplete controller - timesheet n view ongoing////
    .controller('ViewTimeSheetandTasks',function  ($timeout,$scope, $http,$q, $log,projectsSachi,transferSachi,$mdSidenav) {
        var self = this;
        var project;
        self.simulateQuery = false;
        self.isDisabled = false;
        // list of `state` value/display objects
        //self.states        = loadAll();
        self.states = projectsSachi.getOngoingProjects().then(
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
        function querySearch (query) {
            var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
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

        ////////////////////////////////////////
        /////////to show sub tasks in sidenav

        $scope.showSub = function(row) {

            $scope.Tasks = transferSachi.getTasks();
            // console.log($scope.Tasks);
            $mdSidenav('right')
                .toggle();
            var index = $scope.Tasks.tasks.indexOf(row);
            $scope.sub = $scope.Tasks.tasks[index].subtasks;
            console.log($scope.sub);
        };
        ///////////func to disable/enable the approve task btn acc to task status
        $scope.checkStatus = function (row)
        {
            var i = $scope.sub.indexOf(row);
            var st = $scope.sub[i].status;
            if (st != "Submitted")
            {
                return true;
            }

        };

        ////////////func to disable/ennable the cancel task button
        $scope.cancelStatus = function(row)
        {
            var i = $scope.sub.indexOf(row);
            var st = $scope.sub[i].status;
            if (st != "Completed" || st != "Submitted")
            {
                return true;
            }

        }


        ///////////func to change the status of subtask to complete
        $scope.approveTask = function(row)
        {
            var i = $scope.sub.indexOf(row);
            console.log(i)
            var st = $scope.sub[i].task_id;
            var Task = {'taskid':st};
            $http({
                method: 'POST',
                url: '/approveTask',
                data: Task,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data)
            {
                $scope.sub[i].status = "Completed";

                console.log("changed");
            });
        };

        $scope.cancelTask= function(row)
        {
            var i = $scope.sub.indexOf(row);
            var st = $scope.sub[i].task_id;
            var Task = {'taskid':st};
            $http({
                method: 'POST',
                url: '/CancelTask',
                data: Task,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data)
            {
                $scope.sub[i].status = "Ongoing";
                console.log("change canceld");
            });
        };


        ///////////func to change the status of ext task to complete
        $scope.approveETask = function(row)
        {
            var i = $scope.ext.indexOf(row);
            console.log(i)
            var st = $scope.ext[i].extid;
            var Task = {'taskid':st};
            $http({
                method: 'POST',
                url: '/approveETask',
                data: Task,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data)
            {
                $scope.ext[i].TaskStatus = "Completed";

                console.log("changed");
            });
        };



/////////////////////////////func to cancel extended task status
        $scope.cancelExtend = function (row) {
            var i = $scope.ext.indexOf(row);
            console.log(i)
            var extTask = $scope.ext[i].extid;
            var Task = {'taskid':extTask};
            $http({
                method: 'POST',
                url: '/cancelExtended',
                data: Task,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data)
            {
                $scope.ext[i].TaskStatus = "Ongoing";
                console.log("changed");
            });
        };

///////////////////////////vlaidate approve extend task button
        $scope.checkEStatus = function (row)
        {
            var i = $scope.ext.indexOf(row);
            var st = $scope.ext[i].TaskStatus;
            if (st != "Submitted")
            {
                return true;
            }

        };


        $scope.cancelEStatus = function (row)
        {
            var i = $scope.ext.indexOf(row);
            var st = $scope.ext[i].TaskStatus;
            if (st != "Completed" || st != "Submitted" )
            {
                return true;
            }

        };

        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };


        $scope.ongoingProjects = function (){
            project = $('#projectName').val();
            var ProjectName = {'name':project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/ongoingProjects',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                console.log(data);
                $scope.pjtdetails = data;

                $scope.p = $scope.pjtdetails.ProjectDetails;
                $scope.p.client = $scope.pjtdetails.Client;
                $scope.dels = $scope.pjtdetails.Deliverables;
                $scope.tasks = $scope.pjtdetails.Tasks;
                $scope.ext = $scope.pjtdetails.Extendedtasks;
                //$scope.sub = $scope.pjtdetails.Tasks.subtasks;
                transferSachi.addTasks($scope.tasks);
                console.log($scope.tasks);


            });
        };

        $scope.timesheet = function(){
            project = $('#projectName').val();
            var ProjectName = {'name':project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/timesheet',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {
                var timesheet = data;
                $scope.initial_cost = timesheet.initial_cost;
                $scope.current_cost = timesheet.current_cost;
                $scope.task_details = timesheet.tasks;
            })

        }







    });


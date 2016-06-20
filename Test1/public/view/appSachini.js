var ang = angular.module('MyAppSachini',['ngMaterial', 'ngMessages','ui.router','smart-table'])

    .controller('AppCtrl1',   function($scope) {
        var users =[{name:'sachi', age:22},
            {name:'pramo',age:23}];
        $scope.users = users;
    })

    .config(function($stateProvider,$urlRouterProvider,$locationProvider){
        $locationProvider.html5Mode(true);
       // $urlRouterProvider.otherwise('/Add members and Deliverables');
        $stateProvider
            .state('Add members and deliverables', {
                url: '/AddmembersandDeliverables',
                templateUrl: 'view/add_mem_n_del.html'
            })

            // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
            .state('View ongoing project details', {
                url:"/ViewOngoingProjectDetails",
                templateUrl:'view/view_del_n_tasks.html'
            })
            .state('View timesheets', {
                url: '/ViewTimeSheet',
                templateUrl: 'view/view_timesheet.html'
            })
            .state('View project reports', {
                url: '/ViewProjectReport',
                templateUrl: 'view/view_rep_pm.html'
            })
            .state('view_proj_timeline', {
                url: '/projectTimeline',
                templateUrl: 'view/view_proj_timeline.html'
            })
            .state('View clients report', {
                url: '/projectTimeline',
                templateUrl: 'view/client/report.html'
            })
        ;
    })



/////////////////////////////////////////////////////////////////////////
///////////////////////service to get initiated projects////////////////

    .service('projects', function projects($http, $q, transfer){
        var project = this;
        project.members =[];
        project.getAssignedProjects = function(){
            var defer = $q.defer();
            $http.get('/initiatedProjects')
                .success(function(res){
                    defer.resolve(res);
                    project.members=res.data;

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
                })
                .error(function(err,status){
                    defer.reject(err);
                })

            return defer.promise;


        }

        project.getDeliverables= function(){
            var defer = $q.defer();
            $http.get('/getDeliverables')
                .success(function(res){
                    defer.resolve(res);
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

    .service('transfer',function(){
        var trans = this;
        trans.TnS = {};
        trans.addTasks = function(taskArr){
           trans.TnS.tasks = taskArr;

        };
        trans.getTasks = function(){
            return trans.TnS;
        }
        return trans;
       /* trans.projectdetails={};
        trans.setProjectName=function(pname){
            trans.projectdetails.name = pname;
        }
        trans.setTaskID = function(taskID){
            trans.projectdetails.tID = taskID;
        }
        trans.getProjectDetails = function(){
            return trans.projectdetails;
        }*/
    })



    ////////////////////////////////////////////////////////////////
    /////////////////////Side nav controller///////////////////////
    ///////////////view sub tasks in ongoing projects/////////////

    .controller('SideCtrl', function ($scope, $timeout, $mdSidenav, $log, transfer) {
       /* var memberDelete={};
        $scope.removeItem = function removeItem(row){
            var index = $scope.addedMembers.indexOf(row);
            memberDelete = $scope.addedMembers[index];
            console.log(memberDelete);
            $http({
                method: 'POST',
                url: '/deleteMember',
                data: memberDelete,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}
                // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data, status) {
                    console.log(status);
                    if (status == 200) {
                        if (index !== -1){
                            $scope.addedMembers.splice(index,1);
                            //console.log(index);
                        }
                        //alert("Succes");
                    } else {
                        //alert("Error");
                    }
                });
        }*/

       $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function(){
            return $mdSidenav('right').isOpen();
        }
        $scope.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };

        //var tasks = transfer.getTasks();
       $scope.Tasks = transfer.getTasks();
       $scope.sub = [];
        function buildToggler(navID) {

           /* var rowid = document.getElementById("x");
            $scope.subtasks = tasks[rowid].subtasks;
            console.log(rowid);*/
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }
        $scope.showSub = function(row)
        {
            $mdSidenav('right')
                .toggle();
            var index = $scope.Tasks.tasks.indexOf(row);
            $scope.sub = $scope.Tasks.tasks[index].subtasks;
            return $scope.sub;
            console.log($scope.sub);
        }
        $scope.getSub= function () {


        }
    })


    //////////////////////////////////////////////
    /////////chips controller//////////////////
    ///////Add memebers to project-home/////////
    .controller('CustomInputDemoCtrl', function ($timeout,$http, $q,$scope) {
        var self = this;
        var names = [];
        var memnames = {};
        $scope.memnames = memnames;
        $scope.names= names;
        self.readonly = false;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.vegetables = loadVegetables();
        self.selectedVegetables = [];
        console.log( self.selectedVegetables);
        self.numberChips = [];
        self.numberChips2 = [];
        self.numberBuffer = '';
        self.autocompleteDemoRequireMatch = true;
        self.transformChip = transformChip;
        //////////////////////////////////
        //////get memeber name from chp n push to array/////
        self.getChipInfo= function(chip_info) {
            $scope.names.push(chip_info.name);
            // names.name = chip_info.name;
            console.log($scope.names);
        };
        /////////////////////////////////////
        //////remove member name form array whne chip deslected////
        self.removeItem=function(){
            var size = $scope.names.length-1;
            $scope.names.splice(size,1);
            console.log($scope.names);
        }
        ///////addmembers to projects/////////
        $scope.addMembers = function(){
           var members = angular.toJson(names);
            console.log(angular.toJson(names));
            $http({
                method: 'POST',
                url: '/addMembers',
                data: {'memnames': names} ,
                headers: {'Content-Type': 'application/json'}
            });


        }
        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            // Otherwise, create a new one
            return {name: chip, type: 'new'}
        }

        /**
         * Search for vegetables.
         */
        function querySearch(query) {
            var results = query ? self.vegetables.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(vegetable) {
                return (vegetable._lowername.indexOf(lowercaseQuery) === 0) ||
                    (vegetable._lowertype.indexOf(lowercaseQuery) === 0);
            };
        }

        function loadVegetables() {
            var ve = [
                {
                    'name': 'Sachini',
                    'type': 'SE'
                },
                {
                    'name': 'Pramodya',
                    'type': 'SE'
                },
                {
                    'name': 'Nilantha',
                    'type': 'SE'
                },
                {
                    'name': 'Janidu',
                    'type': 'SE'
                },
                {
                    'name': 'Ruwi',
                    'type': 'QE'
                }
            ];
            return ve.map(function (veg) {
                veg._lowername = veg.name.toLowerCase();
                veg._lowertype = veg.type.toLowerCase();
                return veg;
            });
        }
    })



    /////////////////////////////////////////
    //////////Add deliverables dyanmically////
    .controller('MainCtrl', function($scope,$http) {

           $scope.dateFormat =function(date){
             var  m = date.getMonth();
               m=m+1;
               return date.getFullYear()+"-"+ m + "-" + date.getDate();
           };
     //
        $scope.choices = [];
        var deliverables = [];
        var del = [];
        $scope.del = del;
        $scope.deliverables = deliverables;

        $scope.addNewChoice = function() {
            $scope.deliverable = {};
            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newItemNo});
        };

        $scope.removeChoice = function() {
            var lastItem = $scope.choices.length-1;
            var last = $scope.deliverables.length-1;
            $scope.choices.splice(lastItem);
            $scope.deliverables.splice(last,1);
            console.log(deliverables);
        };

        $scope.saveDeliverables =  function(){
            for(var i=0; i<deliverables.length;i++){
                 var d= $scope.dateFormat(deliverables[i].deliverable.deadline);
                $scope.del.push({'deliverable':{'name':deliverables[i].deliverable.name,'deadline':d}});
            }
           $http({
                method: 'POST',
                url: '/addDeliverables',
                data: {'deliverables':del} ,
                headers: {'Content-Type': 'application/json'}
            }).success(function(){
                deliverables.splice(0,deliverables.length);
               del.splice(0,del.length);
               console.log(deliverables);
               console.log(del);
            });
            console.log(del);
        };

    })

    //fusion pie chart.
    .controller('projectPercentageCompletedChartController', function ($scope) {
        $scope.myDataSource = {
            chart: {
                caption: "Project percentage completed",
                subcaption: "",
                startingangle: "120",
                showlabels: "0",
                showlegend: "1",
                enablemultislicing: "0",
                slicingdistance: "15",
                showpercentvalues: "1",
                showpercentintooltip: "0",
                plottooltext: "Project  : $label percentage : $datavalue",
                theme: "ocean"
            },
            data: [
                {
                    label: "Remaining",
                    value: "25%"
                },
                {
                    label: "Completed",
                    value: "75%"
                },

            ]
        }
    })




    /////////////////////////////////////////////////////////////////////
    ////////////directive to change button bg color-not working/////////
    .directive("changecolor",function(){
         var linkfunction = function(scope,elem,attributes){
             elem.bind('click', function() {
                 elem.css('background-color', 'red');
                 scope.$apply(function() {
                     scope.color = "red";
                 });
             });
         }
        return{
            restrict:"E",
            replace: "true",
            link : linkfunction
        };
})
   /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////dialog controller//////////////////////////////////////
    .controller('AppCtrl', function($scope, $mdDialog, $mdMedia) {
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

            // Appending dialog to document.body to cover sidenav in docs app

            $scope.showAdvanced = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'dialog.html',//include the html page u want to link
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen
                })}
        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

    })

/////////////////////////////////////////////////////////////////////////
/////////////////////autocomplete controller////////////////////////////


    .controller('Auto',function  ($timeout,$scope, $http,$q, $log,projects, transfer) {
     ///////*$http shud be injected before $q


            var self = this;
            var project;
            self.simulateQuery = false;
            self.isDisabled    = false;
            // list of `state` value/display objects
            //self.states        = loadAll();
            self.states=    projects.getAssignedProjects().then(
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
                var ProjectName = {'name':project};
                $scope.ProjectName = ProjectName;
                $http({
                    method: 'POST',
                    url: '/assignedprojects',
                    data: ProjectName,  // pass in data as strings
                    headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

                }).success(function (data) {
                    $scope.pjt = data;
                });
            };
        $scope.ongoingProjects=function (){
            project = $('#projectName').val();
            var ProjectName = {'name':project};
            $scope.ProjectName = ProjectName;
            $http({
                method: 'POST',
                url: '/ongoingProjectsRuwini',
                data: ProjectName,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            }).success(function (data) {

                $scope.pjtdetails = data;
                $scope.p = $scope.pjtdetails.ProjectDetails;
                $scope.dels = $scope.pjtdetails.Deliverables;
                $scope.tasks = $scope.pjtdetails.Tasks;
                transfer.addTasks($scope.tasks);
                console.log($scope.tasks);
               // $scope.subtasks = $scope.pjtdetails.Subtasks;
               /*for( var i = 0; i<$scope.subtasks.length;i++){
                   for( var j = 0; j<$scope.tasks.length;j++) {
                       if ($scope.tasks[j].tid == $scope.subtasks[i].task_id){
                           $scope.tasks[j].subT= $scope.subtasks[i];
                       }
                           }
               }*/

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






        })


/////////////////////////////////////////////////////////////////////////
/////////////////////login//////////////////////////////////////////////
 .controller('memberLogin',function($http,$scope,$window) {
        var loginDetails = {};
        var privileges = [];
        $scope.loginDetails = loginDetails;
       // $scope.privileges = privileges;
        $scope.login = function () {
            //console.log('hi');
            $http({
                method: 'POST',
                url: '/login',
                data: loginDetails,  // pass in data as strings
                headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)

            })

                .success(function (data) {
                    privileges = data;
                    console.log(privileges);
                })



        };
    });

/////////////////////////////////////////////////////////////////////////
//////////////////addroles////////////////////////////////////////////////////
 /*   .controller('addCol',function($scope){
        $scope.role="";
        $scope.categories=[];
        $scope.addroles = function(){
            $scope.categories.push({'name':$scope.role});
        };

    })*/





















/////////////////////////////////////////////////////////////////////////
////////////////////////Chip function////////////////////////////////////


function DemoCtrl ($timeout, $q, projects) {
    var self = this;
    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.vegetables =  projects.getMembers().then(
        function(res){
            console.log(res);
            return res.map(function (veg) {
                veg._lowername = veg.name.toLowerCase();
                veg._lowertype = veg.type.toLowerCase();
                return veg;

            });
        },
        function(err){
            console.log('hi');
        });
    self.selectedVegetables = [];
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteDemoRequireMatch = true;
    self.transformChip = transformChip;
    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
        // Otherwise, create a new one
        return {name: chip, type: 'new'}
    }

    /**
     * Search for vegetables.
     */
    function querySearch(query) {
        var results = query ? self.vegetables.filter(createFilterFor(query)) : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(vegetable) {
            return (vegetable._lowername.indexOf(lowercaseQuery) === 0) ||
                (vegetable._lowertype.indexOf(lowercaseQuery) === 0);
        };
    }

    function loadVegetables() {
        var veggies = [
            {
                'name': 'Sachini',
                'type': 'SE'
            },
            {
                'name': 'Pramodya',
                'type': 'SE'
            },
            {
                'name': 'Nilantha',
                'type': 'SE'
            },
            {
                'name': 'Janidu',
                'type': 'SE'
            },
            {
                'name': 'Ruwi',
                'type': 'QE'
            }
        ];
        return veggies.map(function (veg) {
            veg._lowername = veg.name.toLowerCase();
            veg._lowertype = veg.type.toLowerCase();
            return veg;
        });
    }

}



//////////////////////////////////////////////////////////////////////////////////
///////////////////////projects sevice////////////////////////////////////////////

/*
.factory('Project', function($http) {

    return {
        // get all the comments
        get : function() {
            return $http.get('/projectdetails');
        },

        // save a comment (pass in comment data)
        getAssignedProject : function(ProjectName) {
            return $http({
                method: 'POST',
                url: '/assignedprojects',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(ProjectName)
            });
        },

        // destroy a comment
        destroy : function(id) {
            return $http.delete('/api/comments/' + id);
        }
    }

})*/




















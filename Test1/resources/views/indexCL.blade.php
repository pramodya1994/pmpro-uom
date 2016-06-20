<html>
<head>
    <meta charset="UTF-8">
    <title>PM Pro</title>

    <link rel="stylesheet" href="<?=asset('view/bower_components/angular-material/angular-material.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/toolbarCL.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/table.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/style.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/bower_components/bootstrap-3.3.6-dist/css/bootstrap.css')?>"/>

    <script src="<?=asset('view/bower_components/jQuerry/jquery-1.12.2.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/fusioncharts.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular/angular.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-material/angular-material.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-animate/angular-animate.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-aria/angular-aria.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-messages/angular-messages.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-ui-router/release/angular-ui-router.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-smart-table/dist/smart-table.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/fusioncharts.charts.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/angular-fusioncharts.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/ui-bootstrap-tpls-1.3.3.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/bootstrap-3.3.6-dist/js/bootstrap.js')?>"></script>


    <!--fusion charts js goes from here-->

    <script src="<?=asset('view/appCL.js')?>"></script>


</head>
<body ng-app="MyApp" ng-controller="safeCtrl">

<!--
    toolbar code goes from here
    -->


<md-toolbar style="background: #f5f5f5;">
    <div class="md-toolbar-tools">

        <h2>
            <span></span>
        </h2>
        <span flex></span>

        <form name="logForm" method="get" action="/getML">
            <md-button type="submit" class="md-raised btn1" style="color: #8a55f5; background:#ffffff; ">
                Member Login
            </md-button>
        </form>
        <md-button ng-href="view/memberLogin.html" class="md-raised btn1" style="color: #ffffff; background:#8a55f5; ">
            Member Signup
        </md-button>
    </div>
</md-toolbar>

<center>
    <div>
        <p style="font-size: 60px; color: #000000;">Move work
            <br>forward</p>

        <p style="font-size: 20px;">
            PM pro is the easiest way for teams to track their<br>
            work and get results.
        </p>
        <br>
        <br>
        <input style="width: 400px; height: 35px; padding: 15px; margin: 0 0 10px 0;" type="text"
               placeholder="name@company.com"/>
        <br>
        <input style="width: 400px; height: 35px; padding: 15px; margin: 0 0 10px 0;" type="text"
               placeholder="Company password"/>
        <br>
        <md-button ng-href="view/loginCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
            Company Login
        </md-button>
        <md-button ng-href="view/signupCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
            Company Signup
        </md-button>
    </div>
</center>


<!--
    sidenav code goes from here
    -->


</body>
</html>
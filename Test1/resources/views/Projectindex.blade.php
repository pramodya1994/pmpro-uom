<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="<?=asset('view/bower_components/angular-material/angular-material.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/style.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/table.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/bower_components/ng-tags-input/ng-tags-input.css')?>"/>

    <base href="/">
    <script src="<?=asset('view/bower_components/angular/angular.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-material/angular-material.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-animate/angular-animate.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-aria/angular-aria.js')?>"></script>
    <script src="<?= asset('view/bower_components/angular-messages/angular-messages.js')?>"></script>
    <script src="<?= asset('view/bower_components/angular-ui-router/release/angular-ui-router.js')?>"></script>


    <script src="<?=asset('view/bower_components/jQuerry/jquery-1.12.2.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-smart-table/dist/smart-table.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/fusioncharts.js')?>"></script>
    <script src="<?asset('view/bower_components/fusioncharts/js/themes/fusioncharts.theme.carbon.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/angular-fusioncharts.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/themes/fusioncharts.theme.ocean.js')?>"></script>
    <script src="<?=asset('view/bower_components/ui-bootstrap-tpls-1.3.3.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/bootstrap-3.3.6-dist/js/bootstrap.js')?>"></script>

    <link rel="stylesheet" href="<?=asset('view/bower_components/bootstrap-3.3.6-dist/css/bootstrap.css')?>"/>


    <script src="<?=asset('view/client/router.js')?>"></script>

</head>

<body ng-app="MyAppClient" class="toolbardemoBasicUsage">

<!--
    toolbar code goes from here
    -->

<md-toolbar style="background: #3b5998;">

    <div class="md-toolbar-tools" layout="row">

        <div flex="20">
            <img src="images/PMpro.png" align="left" width="254" height="63">
        </div>

        <div flex="80">
            <section layout="column" layout-sm="column" layout-align="center end" layout-wrap>
                <md-button class="btn1 md-raised">Logout</md-button>
            </section>
        </div>

    </div>

</md-toolbar>

<!--
    sidenav code goes from here
    -->

<div layout="row">
    <div  layout="vertical" layout-fill>

        <md-sidenav style="background: #3b5998;" class="md-sidenav-left md-whiteframe-z3" md-is-locked-open="true"
                    flex="20">
            <md-content layout="column" style="background: #3b5998;">


                <md-list >
                    @foreach($privileges as $privilege)


                        <md-list-item>

                            <md-button style="background: #f2f2f2; text-transform: none" ui-sref="{{$privilege}}"
                                       class="btn1"   class=" btn1 md-raised" flex >
                                {{$privilege}}
                            </md-button>

                        </md-list-item>
                    @endforeach


                </md-list>

            </md-content>
        </md-sidenav>


        <md-content class="md-padding" style="width: 1000px">


            <div ui-view>

            </div>


        </md-content>


    </div>
</div>


</body>
</html>
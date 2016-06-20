<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="<?=asset('view/bower_components/angular-material/angular-material.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/table.css')?>"/>
    <base href="/">
    <script src="<?=asset('view/bower_components/angular/angular.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-material/angular-material.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-animate/angular-animate.js')?>"></script>
    <script src="<?=asset('view/bower_components/angular-aria/angular-aria.js')?>"></script>
    <script src="<?= asset('view/bower_components/angular-messages/angular-messages.js')?>"></script>
    <script src="<?= asset('view/bower_components/angular-ui-router/release/angular-ui-router.js')?>"></script>

    <script src="<?=asset('view/bower_components/angular-smart-table/dist/smart-table.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/fusioncharts.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/angular-fusioncharts.min.js')?>"></script>
    <script src="<?=asset('view/bower_components/fusioncharts/js/themes/fusioncharts.theme.ocean.js')?>"></script>




    <script src="<?=asset('view/appSachini.js')?>"></script>
    </head>
<body ng-app="MyAppSachini">
<center>

    <div>
        <p style="font-size: 60px; color: #000000;">PM Pro</p>
    </div>


    <md-card style="width: 500px; height: 500px; vert-align: middle; horiz-align: center;">
        <md-card-content>

            <form name="memberLoginForm" method="post" action="/memberLogin" type="hidden">
                <h2 align="center">Login</h2>

                <table>
                    <tr>
                        <td>
                            <label> E-mail address</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <md-input-container>
                                <input style="background-color: #e6e6ff; width: 300px;" required aria-label="e-mail"
                                       type="email" name="email" id="email" ng-model="email">
                                <div ng-messages="memberLoginForm.email.$error">
                                    <div ng-message="required">Email is required.</div>
                                    <div ng-message="email">Email is invalid.</div>
                                </div>
                            </md-input-container>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Password</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <md-input-container>
                                <input style="background-color: #e6e6ff; width: 300px;" required aria-label="userName"
                                       type="password" name="password" id="password" ng-model="password">
                                <div ng-messages="memberLoginForm.password.$error">
                                    <div ng-message="required">Password is required.</div>
                                </div>
                            </md-input-container>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p> Fogot password? </p>
                            <a href="../../public/view/bower_components">send mail</a>
                        </td>
                    </tr>
                </table>

                <md-button  class="md-raised md-primary" style="float: right" type="submit" ng-disabled="!memberLoginForm.$valid">
                    Login
                </md-button>

            </form>
        </md-card-content>


    </md-card>
    <div float="right">
        <p>Don't have an account?</p>
        <md-button class="md-raised md-primary" style="float:inherit"ng-href="signup.html">SignUp</md-button>

    </div>


</center>


</body>
</html>
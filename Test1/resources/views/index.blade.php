<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>PM Pro</title>

    <!--indexCL.blade.php eke scripts-->
    <link rel="stylesheet" href="<?=asset('view/bower_components/angular-material/angular-material.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/toolbarCL.css')?>"/>
    <link rel="stylesheet" href="<?=asset('view/table.css')?>"/>

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

    <script src="<?=asset('view/appCL.js')?>"></script>



    <script src="<?=asset('theme/js/jquery.js')?>"></script>
    <script src="<?=asset('theme/js/bootstrap.min.js')?>"></script>

    <!-- Bootstrap Core CSS -->
    <link rel="stylesheet" href="<?=asset('theme/css/bootstrap.min.css')?>"/>

    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=asset('theme/css/landing-page.css')?>"/>

    <!-- Custom Fonts -->
    <link rel="stylesheet" href="<?=asset('theme/font-awesome/css/font-awesome.min.css')?>" type="text/css"/>
    <link rel="stylesheet" href="<?=asset('http://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic')?>"
          type="text/css"/>


    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="<?=asset('https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js')?>"></script>
    <script src="<?=asset('https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js')?>"></script>

    <![endif]-->

</head>

<body ng-app="MyApp" ng-controller="safeCtrl">

<!-- Navigation -->
<nav class="navbar navbar-default navbar-fixed-top topnav" role="navigation">
    <div class="container topnav">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand topnav" href="#">PM Pro</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <a href="#about">About</a>
                </li>
                <li>
                    <a href="#services">Services</a>
                </li>
                <li>
                    <a href="#contact">Start</a>
                </li>
                <li>
                    <form name="logForm" method="get" action="/getML">
                        <md-button type="submit" class="md-raised btn1" style="color: #8a55f5; background:#ffffff; ">
                            Member Login
                        </md-button>
                    </form>
                </li>
                <li>
                    <md-button ng-href="view/memberSignup.html" class="md-raised btn1" style="color: #ffffff;
                     background:#8a55f5; height: 36px">
                        Member Signup</md-button>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container -->
</nav>


<!-- Header -->
<a name="about"></a>

<div class="intro-header">
    <div class="container">

        <div class="row">
            <div class="col-lg-12">
                <div class="intro-message">
                    <h1>Move Work Forward</h1>

                    <h3>PM pro is the easiest way for teams to track their<br>
                        work and get results.</h3>
                    <hr class="intro-divider">
                    <ul class="list-inline intro-social-buttons">
                        <!--
                        <li>
                            <a href="https://twitter.com/SBootstrap" class="btn btn-default btn-lg"><i
                                        class="fa fa-twitter fa-fw"></i> <span class="network-name">Twitter</span></a>
                        </li>

                        <li>
                            <a href="https://github.com/IronSummitMedia/startbootstrap"
                               class="btn btn-default btn-lg"><i class="fa fa-github fa-fw"></i> <span
                                        class="network-name">Github</span></a>
                        </li>
                        <li>
                            <a href="#" class="btn btn-default btn-lg"><i class="fa fa-linkedin fa-fw"></i> <span
                                        class="network-name">Linkedin</span></a>
                        </li>
                        -->
                        <li><md-button ng-href="view/loginCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
                                Company Login</md-button>
                        </li>
                        <li>
                            <md-button ng-href="view/signupCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
                                Company Signup</md-button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
    <!-- /.container -->

</div>
<!-- /.intro-header -->

<!-- Page Content -->

<a name="services"></a>

<div class="content-section-a">

    <div class="container">
        <div class="row">
            <div class="col-lg-5 col-sm-6">
                <hr class="section-heading-spacer">
                <div class="clearfix"></div>
                <h2 class="section-heading">Death to the Stock Photo:<br>Special Thanks</h2>

                <p class="lead">A special thanks to <a target="_blank" href="http://join.deathtothestockphoto.com/">Death
                        to the Stock Photo</a> for providing the photographs that you see in this template. Visit their
                    website to become a member.</p>
            </div>
            <div class="col-lg-5 col-lg-offset-2 col-sm-6">
                <img class="img-responsive" src="theme/img/ipad.png" alt="">
            </div>
        </div>

    </div>
    <!-- /.container -->

</div>
<!-- /.content-section-a -->

<div class="content-section-b">

    <div class="container">

        <div class="row">
            <div class="col-lg-5 col-lg-offset-1 col-sm-push-6  col-sm-6">
                <hr class="section-heading-spacer">
                <div class="clearfix"></div>
                <h2 class="section-heading">3D Device Mockups<br>by PSDCovers</h2>

                <p class="lead">Turn your 2D designs into high quality, 3D product shots in seconds using free Photoshop
                    actions by <a target="_blank" href="http://www.psdcovers.com/">PSDCovers</a>! Visit their website to
                    download some of their awesome, free photoshop actions!</p>
            </div>
            <div class="col-lg-5 col-sm-pull-6  col-sm-6">
                <img class="img-responsive" src="theme/img/dog.png" alt="">
            </div>
        </div>

    </div>
    <!-- /.container -->

</div>
<!-- /.content-section-b -->

<div class="content-section-a">

    <div class="container">

        <div class="row">
            <div class="col-lg-5 col-sm-6">
                <hr class="section-heading-spacer">
                <div class="clearfix"></div>
                <h2 class="section-heading">Google Web Fonts and<br>Font Awesome Icons</h2>

                <p class="lead">This template features the 'Lato' font, part of the <a target="_blank"
                                                                                       href="http://www.google.com/fonts">Google
                        Web Font library</a>, as well as <a target="_blank" href="http://fontawesome.io">icons from Font
                        Awesome</a>.</p>
            </div>
            <div class="col-lg-5 col-lg-offset-2 col-sm-6">
                <img class="img-responsive" src="theme/img/phones.png" alt="">
            </div>
        </div>

    </div>
    <!-- /.container -->

</div>
<!-- /.content-section-a -->

<a name="contact"></a>

<div class="banner">

    <div class="container">

        <div class="row">
            <div class="col-lg-6">
                <h2>Connect to Start - PM Pro</h2>
            </div>
            <div class="col-lg-6">
                <ul class="list-inline banner-social-buttons">
                    <!--
                    <li>
                        <a href="https://twitter.com/SBootstrap" class="btn btn-default btn-lg"><i
                                    class="fa fa-twitter fa-fw"></i> <span class="network-name">Twitter</span></a>
                    </li>
                    <li>
                        <a href="https://github.com/IronSummitMedia/startbootstrap" class="btn btn-default btn-lg"><i
                                    class="fa fa-github fa-fw"></i> <span class="network-name">Github</span></a>
                    </li>
                    <li>
                        <a href="#" class="btn btn-default btn-lg"><i class="fa fa-linkedin fa-fw"></i> <span
                                    class="network-name">Linkedin</span></a>
                    </li>
                    -->
                    <li>
                        <md-button ng-href="view/loginCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
                            Company Login
                        </md-button>
                    </li>
                    <li>
                        <md-button ng-href="view/signupCL.html" class="md-raised btn1" style="background: #8a55f5; color:white;">
                            Company Signup
                        </md-button>
                    </li>
                </ul>
            </div>
        </div>

    </div>
    <!-- /.container -->

</div>
<!-- /.banner -->

<!-- Footer -->
<footer>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <ul class="list-inline">
                    <li>
                        <a href="#">Home</a>
                    </li>
                    <li class="footer-menu-divider">&sdot;</li>
                    <li>
                        <a href="#about">About</a>
                    </li>
                    <li class="footer-menu-divider">&sdot;</li>
                    <li>
                        <a href="#services">Services</a>
                    </li>
                    <li class="footer-menu-divider">&sdot;</li>
                    <li>
                        <a href="#contact">Contact</a>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</footer>



</body>

</html>

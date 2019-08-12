<template>
    <footer class="page-footer primary-color-dark center-on-small-only">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <p class='no-marg'>For more information, questions or concerns please contact:</p>
                    <h5 class="title mb-2 mt-3 font-bold">AFPC DSYD</h5>
                    <ul class="">
                        <li class='contact-marg'>Email:&nbsp;&nbsp;<a class='font-bold' href="mailto:DSYD.WorkFlow@us.af.mil?Subject=PERS_STAT Assistance">DSYD.WorkFlow@us.af.mil</a></li>
                        <li class='contact-marg'>DSN:&nbsp;&nbsp;<a class='font-bold' href="tel:+1-312-665-3540">312-665-3540</a></li>
                        <li class='contact-marg'>COM:&nbsp;&nbsp;<a class='font-bold' href="tel:+1-210-565-3540">210-565-3540</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/" tag="li"><a class="nav-link">SURF FLA</a></router-link>
                      <router-link class="footer-link" to="/CIP" tag="li"><a class="nav-link">CIP</a></router-link>
                      <router-link class="footer-link" to="/LookUp" tag="li"><a class="nav-link">LookUp</a></router-link>
                      <router-link class="footer-link" to="/ADP" tag="li"><a class="nav-link">ADP</a></router-link>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold"> Additional Links</h5>
                    <ul>
                        <router-link class="footer-link" to="/" tag="li"><a class="logo-marg nav-link"><img src="../../static/afpc_log.png" height="120px"></a></router-link>
                    </ul>
                </div>
                <div class="footer-copyright">
                    <div class="container-fluid">
                        © 2017-2018 Copyright: United States Air Force
                    </div>
                </div>
            </div>
        </div>
    </footer>
    
</template>

<script></script>

<style>
    a, a:active, a:focus, button, button:active, button:focus {
        outline: none;
    }
    .contact-marg {
        margin: 0 1rem;        
    }
    .logo-marg {
      margin: 0 1rem;
      text-decoration: none;

    }
    .no-marg{
      margin: 0 0;
    }
</style>

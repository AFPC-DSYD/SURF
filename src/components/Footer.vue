<template>
    <footer class="page-footer primary-color-dark center-on-small-only">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <p class='no-marg'>For more information, questions or concerns please contact:</p>
                    <h5 class="title mb-2 mt-3 font-bold">AFPC DSYD</h5>
<!--                     <div class="row"> -->
<!--                         <div class="col-2"> -->
                           <p class='no-marg'>Email: <a class='font-bold' href="mailto:DSYD.WorkFlow@us.af.mil?Subject=PERS_STAT Assistance">DSYD.WorkFlow@us.af.mil</a> </p>
                           <p class='no-marg'>DSN: 312-665-3540</p>
                           <p class='no-marg'>COM: 210-565-3540</p>
<!--                         </div> -->
<!--                         <div class="col">
                        <p class='no-marg'> 
                            
                        </p>
                        <p class='no-marg'></p>
                        <p class='no-marg'></p>
                        </div> -->
<!--                     </div> -->
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/" tag="li"><a class="nav-link">SURF</a></router-link>
                      <router-link class="footer-link" to="/LookUp" tag="li"><a class="nav-link">LookUp</a></router-link>
                      <router-link class="footer-link" to="/ADP" tag="li"><a class="nav-link">ADP</a></router-link>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold"> Additional Links</h5>
                    <ul>
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
    .footer-link {
        height: 30px;
    }
    .no-marg{
      margin: 0 0;
    }
</style>

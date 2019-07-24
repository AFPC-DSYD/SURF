<template>

    <nav class="navbar navbar-expand-lg navbar-dark primary-color-dark fixed-top">
      <img src="../../static/afpc_log.png" height="30px">
      <div class="navbar-brand white-text"><router-link class="white-text" to="/">STARS FLA</router-link></div>
      <button class="navbar-toggler hoverable" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <router-link class="nav-item" to="/" tag="li" active-class="active" exact><a class="nav-link">SURF FLA</a></router-link>
          <router-link class="nav-item" to="/Surf_CIP" tag="li" active-class="active" exact><a class="nav-link">SURF_CIP</a></router-link>
          <router-link class="nav-item" to="/LookUp" tag="li" active-class="active" exact><a class="nav-link">LookUp</a></router-link>
          <router-link class="nav-item" to="/AD_Grab" tag="li" active-class="active" exact><a class="nav-link">AD_Grab</a></router-link>
          <router-link class="nav-item" to="/Vml" tag="li" active-class="active" exact><a class="nav-link">Vml</a></router-link>
          <router-link class="nav-item" to="/ADP" tag="li" active-class="active" exact><a class="nav-link">ADP SURF</a></router-link>
        </ul>
      </div>
    </nav>
    
</template>

<script>
    
</script>

<style scoped>
    .elevate-3 {
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23);
    }

    button:hover {
        background-color: #4285F4;
    }
    button:active {
        background-color: #0d47a1;
    }
</style>

<template>
    <div v-show="showSite" class="container-fluid grey lighten-5">
        <app-navbar></app-navbar>
        <div class="pt-5 mt-3" style="min-height: 800px;">
            <router-view></router-view>
        </div>
        <app-footer></app-footer>
    </div>

</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { store } from '@/store/store'

export default {
    components: {
        'app-navbar': Navbar,
        'app-footer': Footer
    }, 
    computed: {
        showSite(){
            if (store.state.sanity == check_portal)
                return true;
            else return false;
        }
    }
}
</script>

<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: translate(-10,0)rotate(-45deg);
    cursor: pointer;
    cursor: hand;
    pointer-events: auto;
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}


</style>

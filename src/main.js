//Import polyfill so IE can use Promise & Axios
import {polyfill} from 'es6-promise'; polyfill();
var ES6Promise = require("es6-promise");
ES6Promise.polyfill();

//startsWith IE polyfill 
if(!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position){
    return this.substr(position || 0, searchString.length) === searchString;
  };
}

import 'babel-polyfill'
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// if (!Array.from) {
    Array.from = function (object) {
        'use strict';
        //console.log("HAHAHAHAH")
        return [].slice.call(object);
    };
    polyfill();
//}

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import ElementUI from 'element-ui';
import V2Table from 'v2-table';
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(Vuetify)
Vue.use(ElementUI, { locale })
Vue.use(V2Table)

// var JSZip = require("jszip");

import App from './App'
import router from './router'

import axios from 'axios'

//UNCOMMENT baseURL to run in PRODUCTION
axios.defaults.baseURL = 'https://stars.afpc.randolph.af.mil/SASStoredProcess/do'
axios.defaults.headers.get['Accepts'] = 'application/json'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'
// require('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons')
// import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
// import '../node_modules/vuetify/dist/vuetify.min.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'vuetify/dist/vuetify.min.css';

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'

fontawesome.library.add(faSpinner,faQuestionCircle, faInfoCircle)

import { store } from '@/store/store'

router.beforeEach((to, from, next) => {
	 //PROD:
   	//if (store.state.sanity == "SANE"){
	 	if (store.state.sanity != check_portal){
	 	  	var querystring = require('querystring');
          	const formData = {
            	_PROGRAM:"/WebApps/SURF/surf",
            	nPage:"sanity"
          	}
          	var myData = axios.post(axios_url_surf, querystring.stringify(formData))
          	.then(function(response){
            	var mySanity = response.data.sanity;
            	if (mySanity != 'INSANE'){
              		window.location.href = 'https://stars.afpc.randolph.af.mil';
            	} else {
              		store.state.sanity = 'INSANE'
                  store.state.adoff = response.data.adoff
                  store.state.adenl = response.data.adenl
                  store.state.lookup = response.data.lookup
                  store.state.AD = response.data.AD
              		next();
              		//alert('AUTHENTICATED')
            	}
          	}).catch(function(error){
            	console.log(error)
            	window.location.href = 'https://stars.afpc.randolph.af.mil';
          	})
        } else {
          next();
        }
	//}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


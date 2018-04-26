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

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'

//UNCOMMENT baseURL to run in PRODUCTION
//axios.defaults.baseURL = 'https://starsraw.afpc.randolph.af.mil/SASStoredProcess/do'
axios.defaults.headers.get['Accepts'] = 'application/json'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'

fontawesome.library.add(faSpinner,faQuestionCircle, faInfoCircle)

import { store } from '@/store/store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


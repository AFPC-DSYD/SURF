<template>
	<div class='container'>
	<transition-group name="fade" mode="out-in">
	    <loader v-show="!loaded" key="loader"></loader>
	    <div v-show="loaded" key="content">

		<div class="row">
      	<h1 class="col" data-toggle="tooltip" data-placement="top" 
        title="Vulnerable Movers List (VML)">VML</h1>
	      <div class="col-4 text-right" style="margin-top:15px;">
	        Data as of: 
	        <span style="font-weight:bold;color:#4d8bf9"> {{ asDate }} </span>
	      </div>
	    </div>
		<h5 data-toggle="tooltip" data-placement="top" 
        title="Vulnerable Movers List (VML)">Testing out the VML input/output data features</h5>
		<br>
		<div class="row no-top">
			<div class="col-6">
				<div class="row no-top">
					<div class="col">
						<h4> Name: </h4>
						<span>
							<input 	type="text"  class="col-6 form-control" v-model="name" placeholder="Name Search">
							<button class="col-5 btn btn-sm btn-info dropdown-toggle" type="button" id="nameOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ nameCurrent }} </button>
							<div class="dropdown-menu dropdown-primary">
				                <a v-for="(col, index) in nameOptions" class="dropdown-item" href="#" 
				                @click.prevent="nameCurrent=col"> {{ col }} </a>
				            </div>
			            </span>
					</div>
				</div>
				<div class="row no-top">
					<div class="col">
						<h4> SSN: </h4><p class="no-marg">No dashes</p>
						<span>
							<input 	type="text"  class="col-6 form-control" v-model="ssn" placeholder="SSN Search">
							<button class="col-5 btn btn-sm btn-secondary dropdown-toggle" type="button" id="ssnOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ ssnCurrent }} </button>
							<div class="dropdown-menu dropdown-primary">
				                <a v-for="(col, index) in ssnOptions" class="dropdown-item" href="#" 
				                @click.prevent="ssnCurrent=col"> {{ col }} </a>
				            </div>
			            </span>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<h4>DOB Range:</h4>
					</div>
				</div>
				<div class="row">
					<div class="col-6">
						<div class="block">
						    <el-date-picker
						      v-model="startDate"
						      format="MM-dd-yyyy"
						      value-format="MM-dd-yyyy"
						      editable>
						    </el-date-picker>
					  	</div>
					</div>	
					<div class="col-6">
						<div class="block">
						    <el-date-picker
						      v-model="endDate"
						      format="MM-dd-yyyy"
						      value-format="MM-dd-yyyy"
						      editable>
						    </el-date-picker>
					  	</div>
					</div>	
				</div>
			</div>
			<div class="col-6">
				<div class="row">
					<button id="searchBtn" class='btn btn-lg btn-success'
		    					@click.prevent="submitSearch"> Submit Search </button>
				</div>
			</div>
		</div>
		<br>
		<br>
		<div v-show="tableShow" >
			<div class="row">
				<div class="col"></div>
				<div class="col-2">
					<button class='btn btn-lg btn-success'> Save </button>
				</div>
			</div>
			<div class="row">
			<el-table
			    :data="test"
			    stripe
			    max-height="500"
			    :default-sort = "{prop: 'NAME', order: 'ascending'}"
			    style="width:100%;"
			    fit
			    >

			    <el-table-column type="expand">
			      <template slot-scope="props">
			        <h4>Expanded Files: </h4>
			        <p>{{ props.row.EXPANDED }}</p>
			      </template>
			    </el-table-column>

			    <el-table-column
			       prop="TYPE"
			       label="TYPE"
			       sortable
			       min-width="80"
			       >
			    </el-table-column>
			   
			    <el-table-column
			       prop="NAME"
			       label="NAME"
			       sortable
			       min-width="180"
			       >
			    </el-table-column>

			   	<el-table-column
			       prop="SSN"
			       label="SSN"
			       sortable
			       min-width="100"
			       >
			    </el-table-column>

			    <el-table-column
			       prop="GRADE"
			       label="GRADE"
			       sortable
			       min-width="100"
			       >
			    </el-table-column>

			    <el-table-column
			       prop="DOB"
			       label="DOB"
			       sortable
			       min-width="100"
			       >
			    </el-table-column>

			    <el-table-column
			       prop="NOTES"
			       label="NOTES"
			       sortable
			       min-width="480"
			       >
			        <template slot-scope="scope">
				        <el-input v-model="scope.row.NOTES" controls-position="right" @blur="changeNote('NOTES', scope.row.SSN, scope.row.NOTES)"/>
				    </template>
			    </el-table-column>

			    <el-table-column
			      label="Delete"
			      min-width="90"
			      >
			      <template slot-scope="scope">
			        <el-button
			          size="mini"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
			      </template>
			    </el-table-column>
			</el-table>
			</div>
		</div>
		<div v-show="tableShow" class="row">
              <button class="btn btn-sm btn-success" @click="downloadTable">DOWNLOAD Current Table</button>
            </div>
		</div>
    </transition-group> 
	</div>
</template>

<script>
	import DatePicker from './DatePicker'
	import axios from 'axios'
	import loader from './Loader'
	import { store } from '@/store/store'

	export default{
		data(){
			return{
				asDate: 'Undetermined',
				loaded:true,
				name: '',
				ssn: '',
				dob: null,
				nameCurrent:'Contains',
				nameOptions: ['Contains', 'Starts With'],
				ssnCurrent: 'Contains',
				ssnOptions: ['Contains', 'Starts With'],
				dobStart: '',
				dobEnd: null,
				date: null,
				startDate: null,
				endDate: null,
				dateBool: true,
				datetime:null,
			    menu: false,
			    modal: false,
			    menu2: false,
			    show: false,
			    tableShow: false,
			    test: [
			    	
			    ],
			}
		},
		components:{
			DatePicker,
			loader
		},
		mounted(){
			this.asDate = store.state.lookup;
			console.log(this.datetime)
		},
		watch:{
			startDate: function(val){
				if (this.dateBool){
					this.endDate = val;
					this.dateBool = false
				}
			}
		},
		methods:{
			changeNote(col, id, newValue){
				console.log(col + ' -- ' + id + ' -- ' + newValue)
				var querystring = require('querystring');
				const formData = {
	           		'_PROGRAM':"/WebApps/SURF/surf",
	            	'nPage':"vml_insert",
	            	'insertId' : id,
	            	'col':col,
	            	'newValue': newValue,
	          	}
				axios.post(axios_url_surf, querystring.stringify(formData)).then(response => {
					console.log(response)
	            }).catch(function (error) {
				    console.log(error.response);
				});
			},
			downloadTable(){
		      var blob = new Blob([d3.csv.format(this.test)], {type: "text/csv;charset=utf-8"});
		      FileSaver.saveAs(blob, 'Vml.csv');
		    },
			submitSearch(){
				this.loaded=false;
				var querystring = require('querystring');
				var dt = null;
				if (!this.startDate)
					this.startDate = this.endDate;
				if (!this.endDate)
					this.endDate = this.startDate;
				dt = this.startDate + ' ' + this.endDate;
	          	const formData = {
	           		'_PROGRAM':"/WebApps/SURF/surf",
	            	'nPage':"vml",
	            	'name':this.name,
	            	'nameType' : this.nameCurrent,
	            	'ssn': this.ssn,
	            	'ssnType': this.ssnCurrent,
	            	'dob': dt,
	          	}
	          	axios.defaults.headers.get['Accepts'] = 'application/json'
				axios.post(axios_url_vml, querystring.stringify(formData)).then(response => {
					console.log(response)
	                if (response.data.success){
	                	this.test = response.data.data;
	                	this.tableShow = true;
	                	this.loaded=true;
	                } else{
	                	alert(response.data.error)
	                }
	            }).catch(function (error) {
				    console.log(error.response);
				    this.loaded=true;
				});
			},
			handleEdit(index, row) {
		        console.log(index, row);
		    },
		    handleDelete(index, row) {
		    	this.test.splice(index, 1);
		        console.log(index, row);
		    }
		}
	}
</script>

<style scoped>

.el-table__footer-wrapper, .el-table__header-wrapper{
	width: 500;
	color:red;
}

input[type="text"].form-control{
	display: inline-block;
    color:black;
    padding:5px;
    border-radius: 5px;
    position: relative;
    //transform: translateY(-10%);
    margin-bottom: 0px;
    //margin-top: 10px;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow:0px 3px 3px rgba(0,0,0,0.12), 0 3px 3px rgba(0,0,0,0.24);
}

h4{
	font-weight: bold;
	margin-bottom: 0;
}

#searchBtn{
	height: 100px;
	margin-top: 70px;
	margin-left: 70px;
}

.dropdown-toggle{
	display: inline-block;
	//margin-bottom: 0;
	//padding-bottom: 0;
}

.no-top{
	margin-top: 0;
	margin-bottom: 18px;
}

.fade-enter-active {
        transition: all 0.5s; }
    .fade-leave-active {
        transition: all 0.2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .fade-enter-to, .fade-leave {
        opacity: 1;
    }

</style>
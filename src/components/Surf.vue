<template>
	<div class='container'>
		<h1>SURF</h1>
		<div class="row">
			<div id="radioSelect" class="col inline-form-group">
               <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="force" type="radio" value="officer" v-model="force">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Officer</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="force" type="radio" value="enlisted" v-model="force">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Enlisted</span>
                </label>
		    </div>
		</div>
		<div class="row">
			<div id="radioSelect" class="col inline-form-group">
               <label v-show="force=='officer'" class="custom-control custom-radio" >
                    <input class="custom-control-input" name="type" type="radio" value="masked" v-model="type">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Mased </span>
                </label>
                <label v-show="force=='officer'" class="custom-control custom-radio" >
                    <input class="custom-control-input" name="type" type="radio" value="unmasked" v-model="type">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Unmasked</span>
                </label>
                <label v-show="force=='enlisted'" class="custom-control custom-radio" >
                    <input class="custom-control-input" name="type" type="radio" value="with" v-model="type">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">With Proffesional Speciality</span>
                </label>
                <label v-show="force=='enlisted'" class="custom-control custom-radio" >
                    <input class="custom-control-input" name="type" type="radio" value="without" v-model="type">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Without Proffesional Speciality</span>
                </label>
		    </div>
		</div>
		<p>This page is used to generate SURFs.</p>
		<br>
		<h2>Step 1: Upload SSN list </h2>
		<div class="container-responsive">
		    <div class="row">
		      <div class="col-md-12">
		        <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">Drop File Here</div>
		      </div>
		    </div>
		    <br>
		    <div v-show="showGrid" class="container">
		    	<div class="row">
		    		<div class="col-3 no-left">
		    			<h2 >Step 2:Preprocess</h2>
		    		</div>
		    		<div class="col-3">
		    			<div class="dropdown">
				            <!--Trigger-->
				            <button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ dropDownText }} </button>
				            <!--Menu-->
				            <div class="dropdown-menu dropdown-primary">
				                <a v-for="(col, index) in columns" class="dropdown-item" href="#" 
				                @click.prevent="selectCol(index)"> {{ col }} </a>
				            </div>
				        </div>
		    		</div>
		    		<div class="col-2">
		    			<button v-if="selectedCol>=0" class='btn btn-sm btn-amber'
		    					@click.prevent="processSSN"> Process SSNs </button>
		    		</div>
		    		<div class="col">
		    			<button v-for="(sheet, index) in workbook.SheetNames" 
		    					:class="['btn', 'btn-sm', index==currentSheetIndex?'btn-success':'btn-info']"
		    					@click.prevent="changeSheet(index)"> 
		    				{{ sheet }} 
		    			</button>
		    		</div>
		    	</div>
		    	<div class="row">
		    		<div id="myGrid"></div>
		    	</div>
		    	<br>
		    	<div v-show="step3" class="row">
		    		<div style="margin-left:0;padding-left:0" class="col-4">
		    			<h2 >Step 3:Confirm SSNs</h2>
		    		</div>
		    		<div class="col-5">
		    			<button class="btn btn-sm btn-success"> Good: {{numGood}} </button>
		    			<button class="btn btn-sm btn-danger"> Bad: {{numBad}} </button>
		    			<button :class="['btn','btn-sm','btn-amber']" data-toggle="tooltip" data-placement="top" 
		    					title="There are limitations"
		    					@click="validate"> Validate List </button>
					</div>
		    	</div>
		    	<div class="row">
		    		<div id="myGrid2"></div>
		    	</div>
		    </div>
		</div>
	</div>
</template>

<script>
import XLSX from 'xlsx'
import grid from 'canvas-datagrid'
import axios from 'axios'

export default {
	data() {
    	return {
    		showGrid: false,
    		step3: false,
    		workbook: {
    			Sheets:[''],
    			SheetNames: [''],
    		},
    		force: 'officer',	
    		type: 'masked',
    		sheet_json: [],
    		headers: [],
    		selectedCol: -1,
    		currentSheetIndex: 0,
    		myGrid: {
    			data: [''],
    		},
    		myGrid2: {
    			data: [''],
    		},
    		ssnList:[],
    		numGood: 0,
    		numBad: 0,
    		state: {
    			headers: [''],
    			tickets: [''],
    			myGrid:  [],
    		},
    	}
  	},
  	mounted(){
  		//console.log(XLSX) 
  		this.myGrid = canvasDatagrid();
  		//console.log(this.myGrid)
  		document.getElementById('myGrid').appendChild(this.myGrid)
  		this.myGrid2 = canvasDatagrid();
  		//console.log(this.myGrid)
  		document.getElementById('myGrid2').appendChild(this.myGrid2)
  	},
  	computed:{

  		currentSheetName: function(){
  			return this.workbook.SheetNames[this.currentSheetIndex]
  		},
  		worksheet: function(){
  			return  this.workbook.Sheets[this.currentSheetName];
  		}, 
  		columns: function(){
  			return this.headers[this.currentSheetIndex]
  			//return this.sheet_json[this.currentSheetIndex][0];
  		},
  		dropDownText: function(){
  			if (this.selectedCol == -1)
  				return 'Select SSN Column'
  			else return this.columns[this.selectedCol]
  		}
  	},
  	watch: {
  		currentSheetIndex: function(val){
  			this.myGrid.data = this.sheet_json[this.currentSheetIndex];
  			this.selectedCol = -1;	
  		},
  		force: function(val){
  			console.log(val)
  			if (val =='officer')
  				this.type = 'masked'
  			else this.type = 'with'
  		},
  	},
  	methods: {
  		validate(){
  			var list = []
  			this.ssnList.forEach((d)=>{
  				if (d.SSN_FORMAT)
  					list.push(d.SSN)
  			})
  			console.log(list)
  			var querystring = require('querystring');
          	const formData = {
           		'_PROGRAM':"/REN - Dashboard Home V1/makeHTML_collab",
            	'nPage':"validate",
            	'force':this.force,
            	'list': list.join(',')
          	}
          	console.log(formData)
//           var myData = axios.post('', querystring.stringify(formData))
//           .then(function(response){
			axios.post(axios_url, querystring.stringify(formData)).then(response => {
                console.log('DONE?')
            }).catch(console.error)
  		},
  		processSSN(){
  			var select = this.columns[this.selectedCol]
  			if (select == 'UNKNOWN 1')
  				select = '__EMPTY'
  			else if (select.startsWith('UNKNOWN ')){
  				var numb = select.substr(8);
  				//console.log('Ending in ' + numb)
  				select = '__EMPTY_' + numb
  			}
  			this.ssnList = []
  			var checkSSN = 'GOOD'
  			var numGood = 0
  			var numBad = 0

  			var clean = ''
  			var isNum = false
  			this.sheet_json[this.currentSheetIndex].forEach((row)=>{
  				if (row[select]){
	  				clean = row[select].replace(/\W/g, '')
	  				isNum = /^\d+$/.test(clean)

	  				if (clean.length > 9)
	  					isNum = false

	  				if (isNum)
	  					numGood +=1
	  				else numBad +=1

	  				var rep = 9 - clean.length
	  				if (rep > 0)
	  					clean = '0'.repeat(rep) + clean

	  				if (!isNum)
	  					clean = row[select]
	  				this.ssnList.push({
	  					'SSN': clean,
	  					'SSN_FORMAT': isNum
	  				})
	  			}
  			})
  			this.numGood = numGood
  			this.numBad = numBad

  			this.myGrid2.data = this.ssnList
  			//this.myGrid2.data = this.sheet_json[this.currentSheetIndex];
  			this.step3 = true

  			//console.log(this.ssnList)
  			//console.log(this.numGood)
  			//console.log(this.numBad)
  		},
  		selectCol(val){
  			this.selectedCol = val
  		},
  		changeSheet(num){
  			this.currentSheetIndex = num
  			//this.myGrid.data = XLSX.utils.sheet_to_json(this.worksheet)
  		},
	    onFileChange(e) {
      		var files = e.target.files || e.dataTransfer.files;
      		if (!files.length)
        	return;
      		this.createImage(files[0]);
	    },
	    createImage(file) {
	      	var image = new Image();
	      	var reader = new FileReader();
	      	var vm = this;

	      	reader.onload = (e) => {
	        	vm.image = e.target.result;
	      	};
	      	reader.readAsDataURL(file);
	    },
	    removeImage: function (e) {
	      	this.image = '';
	    },
 		get_header_row(sheet) {
		    var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
		    var C, R = range.s.r; /* start in the first row */
		    for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
		        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
		        var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
		        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
		        headers.push(hdr);
		    }
		    return headers;
		},
		fixdata(data) {
			var o = "", l = 0, w = 10240;
			for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
			o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
			return o;
		},
		workbook_to_json(workbook) {
			var result = {};
			workbook.SheetNames.forEach(function(sheetName) {
				var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				if(roa.length > 0){
					result[sheetName] = roa;
				}
			});
			//console.log(result)
			return result;
		},
		/** PARSING and DRAGDROP **/
		handleDrop(e) {
		  e.stopPropagation()
		  e.preventDefault()
		  console.log("DROPPED");
		  var files = e.dataTransfer.files, i, f;
		  //console.log(files.length)
		  for (i = 0, f = files[i]; i != files.length; ++i) {
		    var reader = new FileReader(),
		        name = f.name;
		    reader.onload = (e)=>{
		      	var results, 
		          	data = e.target.result, 
		          	fixedData = this.fixdata(data);

		        this.workbook=XLSX.read(btoa(fixedData), {type: 'base64'}) 
		        for (var d in this.workbook.Sheets){
		        	var sheet = this.workbook.Sheets[d]
		        	this.sheet_json.push(XLSX.utils.sheet_to_json(sheet))
		        	this.headers.push(this.get_header_row(sheet))
		        }
		        //console.log(this.sheet_json)
			    this.myGrid.data = this.sheet_json[this.currentSheetIndex];
			    //console.log(this.myGrid)
		    };
		    reader.readAsArrayBuffer(f);
		  }
		  this.showGrid = true
		},
		handleDragover(e) {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}
 /*Testing only*
var drop=document.getElementById("drop");
if(drop.addEventListener) {
	drop.addEventListener('dragenter', handleDragover, false);
	drop.addEventListener('dragover', handleDragover, false);
	drop.addEventListener('drop', handleDrop, false);
}*/
  	}
}
</script>

<style scoped>
#drop{
border: 2px dashed #bbb;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    padding: 25px;
    text-align: center;
    font: 20pt bold,"Vollkorn";
    color: #bbb;
}

.no-left{
	margin-left:0;
	padding-left:0
}

.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}

</style>
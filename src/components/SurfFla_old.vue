<template>
  <div class='container'>
  <transition-group name="fade" mode="out-in">
    <loader v-show="!loaded" key="loader"></loader>
    <div v-show="loaded" key="content">
    <div class="row">
      <h1 class="col">SURF</h1>
      <div class="col-4 text-right" style="margin-top:15px;">
        Data as of: 
        <span style="font-weight:bold;color:#4d8bf9"> {{ asDate }} </span>
      </div>
    </div>
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
                    <span class="custom-control-description">Masked </span>
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
        <div v-show="step2" class="container">
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
                  @click="changeSheet(index)"> 
                {{ sheet }} 
              </button>
            </div>
          </div>
          <!-- <div class="row">
            <div id="myGrid"></div>
          </div> -->
          <div v-show="showGrid" class="row">
            <v-data-table
                :headers="headersV1"
                :items="myGridTop10"
                hide-actions
                class="elevation-1"               
              >
              <tr slot="items" slot-scope="props">
                <td v-for="col in headersV1">{{ props.item[col.text] }}</td>
              </tr>
            </v-data-table>
          </div>
          <br>
          <div v-show="step3" class="row">
            <div style="margin-left:0;padding-left:0" class="col-4">
              <h2 >Step 3:Confirm SSNs</h2>
            </div>
            <div class="col-3">
              <input  type="text"  class="form-control" v-model="board" placeholder="Board Name">
            </div>
          </div>
          <div v-show="step3" class="row">
            <div class="col-12">
              
              <button class="btn btn-sm btn-info" @click="dialog = true">Add SSN</button>
              <button class="btn btn-sm btn-danger "> Bad: {{numBad}} </button>
              <button :class="['btn','btn-sm','btn-amber']" data-toggle="tooltip" data-placement="top" 
                  title="Validate with our records"
                  @click="validate"> Validate List </button>
              <button v-if="numValidated > 0"
                  :class="['btn','btn-sm','btn-success']" data-toggle="tooltip" data-placement="top" 
                  title="Make sure the currect type of SURF is requested"
                  @click="runSurf"> Run ({{numValidated}}) {{force}} {{typeString}} </button>
          </div>
          </div>

          <!-- <div  class="row">
            <div id="myGrid2"></div>
          </div> -->
          <div v-show="sentWarning" style="margin-top:10px;margin-bottom:10px;">
            <el-tag closable type="warning" @close="sentWarning=false">Request Sent. Average response time is 30 seconds + 10 seconds per 100 SSN.</el-tag>
          </div>
          <div v-show="step3" class="row">
            <div class='col-6'>
              <v-app>
              <v-dialog data-app="true" v-model="dialog" max-width="500px">
                
                <!-- <v-btn v-if="numGood > 0" color="success" dark class="mb-2" @click="runSurf"> Run ({{numGood}}) {{force}} {{typeString}} </v-btn> -->
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6 md4>
                          <v-text-field v-model="editedItem.SSN" label="SSN"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-data-table
                :headers="headersV"
                :items="myGrid2.data"
                hide-actions
                class="elevation-1"
              >
                <tr slot="items" slot-scope="props">
                  <td @click="" class="text-xs-right">{{ props.item.SSN }}</td>
                  <td @click="" class="text-xs-right">{{ props.item.SSN_FORMAT }}</td>
                  <td @click="" class="text-xs-right">{{ props.item.VALIDATED }}</td>
                  <td @click="" class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                      <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </v-data-table>
            
            </v-app>
            </div>
          </div>
          <div v-show="step3" class="row">
            <div class="col-6">
              <a v-show="showButton" :href="href" :download="boardLink + ' ' + typeString + '.zip'" ref="surfButton"
                  class="btn btn-sm btn-info "> TEST </a> 
            </div>
          </div>
        </div>
    </div>
    </div>
    </transition-group> 
  </div>
</template>


<script>
import XLSX from 'xlsx'
import axios from 'axios'
import loader from './Loader'
import { store } from '@/store/store'

export default {
  data() {
      return {
        asDate: 'Undetermined',
        sentWarning: false,
        loaded:true,
        showGrid: false,
        step3: false,
        step2: false,
        showButton: false,
        board: '',
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
        dialog: false,
        editedIndex: -1,
        editedItem: {
          SSN: '',
        },
        defaultItem: {
          SSN: '',
        },
        headersV: [],
        href: '',
        ssnList:[],
        numGood: 0,
        numBad: 0,
        numValidated: 0,
        state: {
          headers: [''],
          tickets: [''],
          myGrid:  [],
        },
      }
    },
    mounted(){
      this.asDate = store.state.adoff;
    },
    components:{
      loader
    },
    computed:{
      boardLink(){
        if (this.board)
          return this.board;
        else return 'SURF';
      },
      myGridTop10(){
        var limit = this.myGrid.data.length
        if (limit > 10)
          limit = 10
        return this.myGrid.data.slice(0, limit)
      },
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      typeString:function(){
        var test = this.type;
        if (test == 'masked')
          return 'Masked'
        else if (test == 'unmasked')
          return 'Unmasked'
        else if (test == 'with')
          return 'With Proffesional Speciality'
        else if (test == 'without')
          return 'Without Proffesional Speciality'
      },
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
      headersV1: function(){
        var col = this.headers[this.currentSheetIndex];
        var toReturn = []
        if (col){
          col.forEach((d)=>{
              toReturn.push({
                'text': d,
                'value': d,
              })
          })
        }
        return toReturn;
      },
      dropDownText: function(){
        if (this.selectedCol == -1)
          return 'Select SSN Column'
        else return this.columns[this.selectedCol]
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      selectedCol (val){
        this.showGrid = true
      },
      currentSheetIndex: function(val){
        this.showGrid = true
        this.myGrid.data = this.sheet_json[this.currentSheetIndex];
        // this.headersV1 = [];
        // this.columns.forEach((d)=>{
        //   this.headersV1.push({
        //     'text': d,
        //     'value': d,
        //   })
        // })
        this.selectedCol = -1;  
      },
      force: function(val){
        if (val =='officer'){
          this.type = 'masked'
          this.asDate = store.state.adoff
        } else {
          this.type = 'with'
          this.asDate = store.state.adenl
        } 
        this.numValidated = 0
      },
    },
    methods: {
      downlaodZip(){
        this.loaded=false;
        var list = []
        var getList = this.parse(this.ssnList, 'SSN', 1)
        getList.forEach((d)=>{
          if (d.SSN_FORMAT)
            list.push(d.SSN)
        })  

        var querystring = require('querystring');
        const formData = {
          '_PROGRAM':"/REN - Dashboard Home V1/makeHTML",
          'nPage':"runSurf",
          'force':this.force,
          'type' : this.type,
          'board': this.board,
          'list': list.join(',')
        }

      

        axios.post(
          axios_url_surf,
          {
            data: querystring.stringify(formData),
            headers: {
                'Content-Type': 'application/zip',
                'Accept': 'application/zip'
            },
            responseType: 'arraybuffer',
          }
        ).then(response => {
          var reader = new window.FileReader();
          console.log(response)

          this.loaded=true;
        }).catch(function (error) {
            console.log(error.response);
            this.loaded=true;
        });

        // axios.post(axios_url_surf, querystring.stringify(formData)).then(response => {
        //     this.onReturn(response.data)
        // }).catch(function (error) {
        //     console.log(error.response);
        //     this.loaded=true;
        // });
      },
      editItem (item) {
        this.editedIndex = this.myGrid2.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.myGrid2.data.indexOf(item)
        this.myGrid2.data.splice(index, 1)
        var parsed = this.parse(this.myGrid2.data, 'SSN', 1)
        this.myGrid2.data = parsed
        this.step3 = true
      },
      close () {
        this.dialog = false
        var parsed = this.parse(this.myGrid2.data, 'SSN', 1)
        this.myGrid2.data = parsed
        this.step3 = true
        //this.numGood = 0
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.myGrid2.data[this.editedIndex], this.editedItem)
        } else {
          this.myGrid2.data.push(this.editedItem)
          var parsed = this.parse(this.myGrid2.data, 'SSN', 1)
          this.myGrid2.data = parsed
          this.step3 = true
          //this.numGood = 0
        }
        this.close()
      },
      onReturn(returned){
          var statusFormat = {
            '1':'GOOD',
            '7':'NOT FOUND ON FILE',
            '8':'DUPLICATE',
            '9':'ERROR',
          }
          if (returned.data){
            var ret = returned .data;
            ret.forEach((record)=>{
              record.STATUS = statusFormat[record.STATUS]
            })
            var parsed = this.parse(ret, 'SSN', 2)
          this.myGrid2.data = parsed
          this.step3 = true
          this.numValidated = this.numGood;
          }
          this.loaded=true;
      },
      validate(){
        this.loaded=false;
        var list = []
        var getList = this.parse(this.ssnList, 'SSN', 1)
        getList.forEach((d)=>{
          if (d.SSN_FORMAT)
            list.push(d.SSN)
        })
        var querystring = require('querystring');
            const formData = {
              '_PROGRAM':"/REN - Dashboard Home V1/makeHTML",
              'nPage':"validate",
              'force':this.force,
              'type' : this.type,
              'list': list.join(',')
            }
      axios.post(axios_url_surf, querystring.stringify(formData)).then(response => {
                this.onReturn(response.data)
            }).catch(function (error) {
                console.log(error.response);
                this.loaded=true;
            });
      },
      runSurf(){
        this.sentWarning = true;
        var list = []
        var getList = this.parse(this.ssnList, 'SSN', 1)
        getList.forEach((d)=>{
          if (d.SSN_FORMAT)
            list.push(d.SSN)
        })
        var querystring = require('querystring');
            const formData = {
              '_PROGRAM':"/REN - Dashboard Home V1/makeHTML",
              'nPage':"runSurf",
              'force':this.force,
              'type' : this.type,
              'board': this.board,
              'list': list.join(',')
            }
            this.href = axios_url_surf + '?' + querystring.stringify(formData);
            const elem = this.$refs.surfButton
            setTimeout(function() {
                elem.click()
            },500)
      },
      parse(data, select, option){
        this.ssnList = []
        var checkSSN = 'GOOD'
        var numGood = 0
        var numBad = 0

        var clean = ''
        var isNum = false
        data.forEach((row)=>{
          if (row[select]){
            clean = row[select].replace(/\W/g, '')
            isNum = /^\d+$/.test(clean)

            if (clean.length > 9)
              isNum = false

            var rep = 9 - clean.length
            if (rep > 0)
              clean = '0'.repeat(rep) + clean

            if (!isNum)
              clean = row[select]

            var status = '';
            if (option == 2){
              status = row['STATUS']
              if (status == 'GOOD')
                numGood +=1
              else 
                numBad +=1
            } else if (option == 1){
              if (!isNum)
              numBad +=1
            }

            if (option == 1){
              this.ssnList.push({
                'SSN': clean,
                'SSN_FORMAT': isNum
              })
            } else if (option == 2){
              this.ssnList.push({
                'SSN': clean,
                'SSN_FORMAT': isNum,
                'VALIDATED': status,
              })
            }
          }
        })
        this.numGood = numGood
        this.numBad = numBad

        return this.ssnList;
      },
      processSSN(){
        var select = this.columns[this.selectedCol]
        if (select == 'UNKNOWN 1')
          select = '__EMPTY'
        else if (select.startsWith('UNKNOWN ')){
          var numb = select.substr(8);
          select = '__EMPTY_' + numb
        }
        var parsed = this.parse(this.sheet_json[this.currentSheetIndex], select, 1)
        //console.log(this.sheet_json[this.currentSheetIndex])
        this.myGrid2.data = parsed
        this.step3 = true
        this.showGrid = false
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
            //var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
            var hdr ='';
            if (C == 1)
              hdr = '__EMPTY'
            else 
              hdr = '__EMPTY_' + C;
            if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
            headers.push(hdr);
        }
        //console.log(headers)
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
      return result;
    },
    /** PARSING and DRAGDROP **/
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      console.log("DROPPED");
      var files = e.dataTransfer.files, i, f;
      for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader(),
            name = f.name;
        reader.onload = (e)=>{
            var results, 
                data = e.target.result, 
                fixedData = this.fixdata(data);
            this.workbook=XLSX.read(btoa(fixedData), {type: 'base64'}) 
            this.sheet_json = []
            this.headers = []
            //this.selectedCol = 1;
            for (var d in this.workbook.Sheets){
              var sheet = this.workbook.Sheets[d]
              var page = XLSX.utils.sheet_to_json(sheet)

              this.sheet_json.push(page)
              this.headers.push(this.get_header_row(sheet))
            }
          // this.myGrid = canvasDatagrid();
          var div = document.getElementById('myGrid');
          this.myGrid.data = this.sheet_json[this.currentSheetIndex];
          
          // while(div.firstChild){
          //     div.removeChild(div.firstChild);
          // }
          // document.getElementById('myGrid').appendChild(this.myGrid)
        };
        reader.readAsArrayBuffer(f);
      }
      this.headersV = [
        {
          text: 'SSN',
          align: 'left',
          value: 'SSN'
        },
        { text: 'SSN_FORMAT', value: 'SSN_FORMAT' },
        ,
        { text: 'VALIDATED', value: 'VALIDATED' }
      ]
      this.showGrid = true
      this.step2 = true
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  },
  beforeUpdate() {
    console.log("beforeupdate")
    console.log(this.headersV1)
    console.log(this.columns)
  },
}
</script>
<!-- 
<link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet"> -->
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

input[type="text"].form-control{
    color:black;
    padding:5px;
    border-radius: 5px;
    position: relative;
    //transform: translateY(-10%);
    margin-bottom: 0px;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow:0px 3px 3px rgba(0,0,0,0.12), 0 3px 3px rgba(0,0,0,0.24);
}

.fade-enter-active {
    transition: all 0.5s; 
}
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
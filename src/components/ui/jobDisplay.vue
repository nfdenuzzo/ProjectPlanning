<template>
  <div class="displayJob">
    <el-row>
      <el-col :span="24" v-for="(item, index) in getCurrentJobsForEmployees" :key="index">
          <div class="grid-content">
            <el-row :gutter="2">
              <el-col :span="1">
                <div class="grid-content  grid-content-bg">
                  {{item.sequence}}
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content  grid-content-bg">
                  {{item.isProductive? 'Yes' : 'No'}}
                </div>
              </el-col>
              <!-- job code input -->
              <el-col :span="4">
                <div class="grid-content grid-content-bg">
                  {{item.jobCardNo}}
                </div>
              </el-col>
              <!-- work code input -->
              <el-col :span="4">
                <el-tooltip :content="item.workCentreDescription" placement="left">
                  <div class="grid-content grid-content-bg">
                    {{item.workCentreDescription}}
                  </div>
                </el-tooltip>
              </el-col>
              <!-- task input -->
              <el-col :span="4">
                <el-tooltip :content="item.productiveTask? item.productiveTaskDescription : item.nonProductiveTaskDescription" placement="right">
                  <div class="grid-content grid-content-bg">
                    {{item.productiveTask? item.productiveTaskDescription : item.nonProductiveTaskDescription}}
                  </div>
                </el-tooltip>
              </el-col>
              <!-- hours input -->
              <el-col :span="3">
                <div class="grid-content grid-content-bg">
                  {{item.hours}}
                </div>
              </el-col>
              <!-- operations buttons-->
              <el-col :span="5">
                <div class="grid-content-buttons grid-content-bg">
                  <el-button :disabled="validateDate()" size="mini" type="warning" icon="el-icon-edit" circle @click="openCloseJobEdit(item)"></el-button>
                  <el-button :disabled="validateDate()" size="mini" type="danger" icon="el-icon-delete" circle @click="removeJob(item)" ></el-button>
                  <el-button :disabled="validateDate() || index == 0" size="mini" type="primary" icon="el-icon-caret-top" circle @click="moveJobItem(item, false)" ></el-button>
                  <el-button :disabled="validateDate() || index == getCurrentJobsForEmployeesLength()" size="mini" type="primary" icon="el-icon-caret-bottom" circle @click="moveJobItem(item, true)" ></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'displayJob',
  data () {
    return {
    }
  },
  methods: {
    openCloseJobEdit (item) {
      this.$emit('update:jobItem', item)
      this.$emit('open-close-job-edit', true)
    },
    removeJob (item) {
      this.$confirm('Do you want to delete this?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        this.setGlobalLoading(true)
        this.$store.dispatch({
          type: 'removeEmployeeJobPlanningAndReload',
          id: item.id
        }).then(() => {
          this.showSuccessNotification('Job was successfully removed.')
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          this.setGlobalLoading(false)
        })
      }).catch(() => {
      })
    },
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    },
    showSuccessNotification (message) {
      this.$message({
        message: message,
        type: 'success'
      })
    },
    validateDate () {
      let formatedDate = this.$dateHelper.helperStandardDateOnlyFormat(this.$store.getters.getSelectedTabDay)
      return this.$editableChecker.checkIfNotEditable(formatedDate)
    },
    moveJobItem (item, isDown) {
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'swapPlanningAndReload',
        id: item.id,
        isDown: isDown
      }).then(() => {
        this.showSuccessNotification(`Job was successfully moved ${isDown ? 'down' : 'up'} .`)
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    getCurrentJobsForEmployeesLength () {
      return this.$store.getters.getCurrentPlannedJobs.length - 1
    }
  },
  computed: {
    getCurrentJobsForEmployees () {
      return this.$store.getters.getCurrentPlannedJobs
    }
  }
}
</script>

<style scoped>

  .el-row {
    position: relative;
  }

  .displayJob {
    margin-top: 3px;
  }

  .grid-content {
    min-height: 60px;
    font-size: 1vw;
    color: #fff;
    line-height: 60px;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grid-content-buttons {
    min-height: 59px;
    font-size: 1vw;
    color: #fff;
    max-height: 60px;
  }

  .grid-content-bg {
    background: #34495E;
  }

  .radioButton {
    color: #fff !important;
    margin: 10px 10px;
  }

  .grid-content-indicator{
    min-height: 10px;
  }

  .grid-content-indicator-unsaved {
    background: #F56C6C !important;
  }
</style>

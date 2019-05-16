<template>
  <div class="addNewJob" v-loading="loadingWorkCentres">
    <el-row>
      <el-col :span="24">
        <div class="grid-content-indicator" :class=" isAdd ? 'grid-content-indicator-add' : 'grid-content-indicator-edit' ">
          {{ !isAdd? jobItem.jobCardNo? 'Edit job planning [ job number = ' + jobItem.jobCardNo + ' ]' : 'Edit job planning [ sequence = ' + jobItem.sequence + ' ]': 'Add new job planning'}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="grid-content bg-purple-dark">
            <el-row :gutter="2">
              <el-col :span="1">
                <div class="grid-content-label grid-content-bg">
                  {{ isAdd? calcSequence() : ruleForm.sequence }}
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content grid-content-bg">
                  <el-form-item prop="productiveSelected">
                    <el-switch
                      class="input-switch"
                      @change="getProductiveTasks"
                      style="display: block"
                      v-model="ruleForm.productiveSelected"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="Yes"
                      inactive-text="No">
                    </el-switch>
                  </el-form-item>
                </div>
              </el-col>
              <!-- job code input -->
              <el-col :span="4">
                <div class="grid-content-plain grid-content-bg">
                  <multiselect
                  :disabled="!this.ruleForm.productiveSelected"
                  class="multiDropdown"
                  v-model="ruleForm.jobNumberSelected"
                  :options="getJobs"
                  :optionsLimit="100"
                  selectLabel=""
                  selectedLabel=""
                  deselectLabel=""
                  @select="onJobCodeChange"
                  :searchable="true"
                  track-by="jobCardNo"
                  label="jobCardNo"
                  placeholder="Select one"
                  ></multiselect>
                </div>
              </el-col>
              <!-- work center input -->
              <el-col :span="4">
                <div class="grid-content-plain grid-content-bg">
                  <el-tooltip :disabled="!ruleForm.workCenterSelected" :content="ruleForm.workCenterSelected ? `${ruleForm.workCenterSelected.workCentreNo} - ${ruleForm.workCenterSelected.workCentreDescription}` : ''" placement="top">
                      <multiselect
                        class="multiDropdown"
                        v-model="ruleForm.workCenterSelected"
                        :options="getWorkCenters"
                        :optionsLimit="100"
                        selectLabel=""
                        selectedLabel=""
                        deselectLabel=""
                        :searchable="true"
                        track-by="workCentreNo"
                        :custom-label="customWorkCentreLabel"
                        placeholder="Select one"
                      ></multiselect>
                  </el-tooltip>
                </div>
              </el-col>
              <!-- task input -->
              <el-col :span="4">
                <div class="grid-content-plain grid-content-bg">
                  <el-tooltip :disabled="!ruleForm.taskSelected" :content="ruleForm.taskSelected ? `${ruleForm.taskSelected.task} - ${ruleForm.taskSelected.taskDescription}` : ''" placement="top">
                    <multiselect
                      class="multiDropdown"
                      v-model="ruleForm.taskSelected"
                      :options="availableTasks"
                      :optionsLimit="100"
                      selectLabel=""
                      selectedLabel=""
                      deselectLabel=""
                      :searchable="true"
                      track-by="task"
                      :custom-label="customTaskLabel"
                      placeholder="Select one"
                    ></multiselect>
                  </el-tooltip>
                </div>
              </el-col>
              <!-- hours input -->
              <el-col :span="3">
                <div class="grid-content grid-content-bg">
                  <el-form-item prop="totalHours">
                    <el-input-number
                    controls-position="right"
                    v-model="ruleForm.totalHours"
                    size="large"
                    style="width: 90%;margin: 10px 5%;"
                    :min="minHours"
                    :max="maxHours">
                    </el-input-number>
                  </el-form-item>
                </div>
              </el-col>
              <!-- operations buttons-->
              <el-col :span="5">
                <div class="grid-content-buttons  grid-content-bg">
                  <el-button size="mini" type="success" icon="el-icon-check" circle @click="submitForm()"></el-button>
                  <el-button size="mini" type="danger" icon="el-icon-close" circle @click="resetForm(true)"></el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'

export default {
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    jobItem: {
      type: Object,
      default: null
    }
  },
  name: 'addNewJob',
  components: {
    multiselect
  },
  data () {
    return {
      loadingWorkCentres: false,
      minHours: 0,
      maxHours: 24,
      ruleForm: {
        sequence: '',
        jobNumberSelected: '',
        workCenterSelected: '',
        taskSelected: '',
        productiveSelected: true,
        totalHours: 0
      },
      rules: {
        productiveSelected: [
          { required: true, message: 'Please select Productivity', trigger: 'blur' }
        ],
        totalHours: [
          { required: true, message: 'Please input total hours', trigger: 'blur' }
        ]
      },
      availableTasks: []
    }
  },
  mounted () {
    this.resetForm(false)
    this.getProductiveTasks()
    if (!this.jobItem && !this.isAdd) {
      this.showInfoMessageDialog('unkown error occured.', 'Edit Job')
      this.$emit('close-add-new-job', true)
    }

    if (this.jobItem && !this.isAdd) {
      // job number
      if (this.jobItem.sequence) {
        this.ruleForm.sequence = this.jobItem.sequence
      }

      // job number
      if (this.jobItem.jobCardNo) {
        let jobs = this.$store.getters.getJobs
        let index = jobs.findIndex(f => f.jobCardNo === this.jobItem.jobCardNo)

        // check if index is valid
        if (index < 0 || index > jobs.length) {
          this.showInfoMessageDialog('unkown error occured.', 'Edit Job')
          this.$emit('close-add-new-job', true)
        }

        this.ruleForm.jobNumberSelected = jobs[index]
      }

      // work center
      if (this.jobItem.workCentreNo) {
        let workCenters = this.$store.getters.getWorkCentres
        let index = workCenters.findIndex(f => f.workCentreNo === this.jobItem.workCentreNo)

        // check if index is valid
        if (index < 0 || index > workCenters.length) {
          this.showInfoMessageDialog('unkown error occured.', 'Edit Job')
          this.$emit('close-add-new-job', true)
        }

        this.ruleForm.workCenterSelected = workCenters[index]
      }

      // no productive task center
      if (this.jobItem.nonProductiveTask && !this.jobItem.isProductive) {
        let noProductiveTasks = this.$store.getters.getNonProductiveTasks
        this.availableTasks = noProductiveTasks
        let index = noProductiveTasks.findIndex(f => f.task === this.jobItem.nonProductiveTask)

        // check if index is valid
        if (index < 0 || index > noProductiveTasks.length) {
          this.showInfoMessageDialog('unkown error occured.', 'Edit Job')
          this.$emit('close-add-new-job', true)
        }

        this.ruleForm.taskSelected = noProductiveTasks[index]
      }

      // productive task center
      if (this.jobItem.productiveTask && this.jobItem.isProductive) {
        let productiveTasks = this.$store.getters.getProductiveTasks
        this.availableTasks = productiveTasks
        let index = productiveTasks.findIndex(f => f.task === this.jobItem.productiveTask)

        // check if index is valid
        if (index < 0 || index > productiveTasks.length) {
          this.showInfoMessageDialog('unkown error occured.', 'Edit Job')
          this.$emit('close-add-new-job', true)
        }

        this.ruleForm.taskSelected = productiveTasks[index]
      }

      // Productive center
      this.ruleForm.productiveSelected = this.jobItem.isProductive

      // hours center
      if (this.jobItem.hours) {
        this.ruleForm.totalHours = this.jobItem.hours
      }
    }
  },
  methods: {
    customTaskLabel ({ task, taskDescription }) {
      return `${task} – ${taskDescription}`
    },
    customWorkCentreLabel ({ workCentreNo, workCentreDescription }) {
      return `${workCentreNo} – ${workCentreDescription}`
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // job number
          if (this.ruleForm.productiveSelected) {
            if (!this.ruleForm.jobNumberSelected) {
              this.showWarningMessageDialog('Please select a job number.')
              return
            }
          }

          // work center
          if (!this.ruleForm.workCenterSelected) {
            this.showWarningMessageDialog('Please select a work centre.')
            return
          }

          // task
          if (!this.ruleForm.taskSelected) {
            this.showWarningMessageDialog('Please select a task.')
            return
          }

          // hours
          if (!this.ruleForm.totalHours) {
            this.showWarningMessageDialog('Please input number of hours')
            return
          }

          let employeesSelected = this.$store.getters.getSelectedEmployees.map(item => item.id)
          let formatedDate = this.$dateHelper.helperStandardDateOnlyFormat(this.$store.getters.getSelectedTabDay)
          // create job object
          let jobObject = {
            Date: formatedDate,
            IsProductive: this.ruleForm.productiveSelected,
            EmployeeIds: employeesSelected,
            JobCardNo: this.ruleForm.jobNumberSelected.jobCardNo,
            WorkCentreNo: this.ruleForm.workCenterSelected.workCentreNo,
            Task: this.ruleForm.taskSelected.task,
            Hours: this.ruleForm.totalHours,
            Sequence: this.calcSequence()
          }

          // set loading
          this.setGlobalLoading(true)

          // insert new job for selected employees
          if (this.isAdd) {
            this.$store.dispatch({
              type: 'addEmployeeJobPlanningAndReload',
              data: jobObject
            }).then(() => {
              this.showSuccessNotification('New job was successfully added.')
            }).catch((error) => {
              console.log(error)
            }).finally(() => {
              this.setGlobalLoading(false)
            })
          } else {
            // update job item
            this.$store.dispatch({
              type: 'updateEmployeeJobPlanningAndReload',
              data: jobObject,
              id: this.jobItem.id
            }).then(() => {
              this.showSuccessNotification('Job was successfully updated.')
            }).catch((error) => {
              console.log(error)
            }).finally(() => {
              this.setGlobalLoading(false)
            })
          }

          this.resetForm(true)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (close) {
      this.$refs['ruleForm'].resetFields()
      if (close) {
        this.$emit('close-add-new-job', true)
      }
    },
    getProductiveTasks () {
      this.ruleForm.taskSelected = ''
      this.availableTasks = []
      if (this.ruleForm.productiveSelected) {
        this.availableTasks = this.$store.getters.getProductiveTasks
      } else {
        this.ruleForm.jobNumberSelected = ''
        this.availableTasks = this.$store.getters.getNonProductiveTasks
      }
    },
    showWarningMessageDialog (message) {
      this.$alert(message, this.isAdd ? 'Job Add' : 'Job Edit', {
        confirmButtonText: 'OK'
      })
    },
    showInfoMessageDialog (message, title) {
      this.$alert(message, title, {
        confirmButtonText: 'OK'
      })
    },
    showSuccessNotification (message) {
      this.$message({
        message: message,
        type: 'success'
      })
    },
    calcSequence () {
      return this.$store.getters.getCurrentPlannedJobs.length + 1
    },
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    },
    onJobCodeChange (selectedJob) {
      if (this.shouldReloadWorkCentres) {
        this.loadingWorkCentres = true
        this.$httpClient.getJobWorkCentresRequest(selectedJob.jobCardNo).then((response) => {
          this.$store.commit({
            type: 'setWorkCentres',
            workCentres: response.data
          })
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          this.loadingWorkCentres = false
        })
      }
    }
  },
  computed: {
    getWorkCenters () {
      return this.$store.getters.getWorkCentres
    },
    getJobs () {
      return this.$store.getters.getJobs
    },
    shouldReloadWorkCentres () {
      return this.$store.getters.getJobClocking_JobWorkCentreOnly
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>

  .el-form-item {
    margin-bottom: 0px !important;
    height: 60px;
  }

  .addNewJob{
    margin-top: 3px;
  }

  .el-row {
    position: relative;
  }

  .grid-content-heading {
    min-height: 25px;
    line-height: 25px;
    font-size: 1vw;
    color: #1C2833;
    background: #828282;
  }

  .grid-content-heading-inner {
    min-height: 100%;
    line-height: 30px;
    font-size: 1vw;
    color: #1C2833;
  }

  .grid-content {
    min-height: 60px;
    font-size: 1vw;
    color: #fff;
  }

  .grid-content-label {
    line-height: 60px;
    min-height: 60px;
    font-size: 1vw;
    color: #fff;
  }

  .grid-content-inner-split {
    min-height: 60px;
    line-height: 55px;
    font-size: 1vw;
    color: #1C2833;

    display: flex;
    flex-wrap: nowrap;
  }

  .grid-content-sub-heading {
    min-height: 25px;
    line-height: 25px;
    font-size: 1vw;
    color: #fff;
    background: transparent;
    margin-bottom: 1px;
  }

  .grid-content-plain {
    min-height: 60px;
    font-size: 1vw;
    padding-left: 8px;
    padding-right: 8px;
    color: #fff;
  }

  .input-switch {
    height: 100%;
    transform: translate(0%, 100%);
  }

  .grid-content-sub-heading-bg {
    background: #5D6D7E  ;
  }

  .grid-content-bg {
    background: #34495E  ;
  }

  .selectInputs{
    margin: 10px 10px;
    /* display: block !important; */
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .radioButton{
    color: #fff !important;
    margin: 10px 10px;
  }

  .multiDropdown {
    transform: translate(0%, 25%);
    margin: 0px auto;
    font-size: 1vw;
  }

  .multiDropdown input {
    width: 100% !important;
  }

  .grid-content-indicator {
    padding-left: 10px;
    min-height: 25px;
    font-size: 0.8vw;
    text-align: left;
    font-weight: bold;
    line-height: 25px;
  }

  .grid-content-indicator-add{
    background: #67C23A !important;
  }

  .grid-content-indicator-edit{
    background: #E6A23C !important;
  }

  .grid-content-buttons {
    min-height: 60px;
    line-height: 60px;
    font-size: 1vw;
    color: #fff;
    max-height: 60px;
  }
</style>

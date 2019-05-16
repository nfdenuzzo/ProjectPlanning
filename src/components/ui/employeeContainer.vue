<template>
  <div>
    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content">
          <el-button :disabled="isAddButtonDisableCheck()" @click="addNewJob()" style="width: 95%;margin-left: 2.5%;" type="success">Add Job</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content-small">
          Filter By
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content" style="margin-left: 10px;">
          <el-checkbox v-model="filterByOrg" @change="onFilterByOrgChange">Org structure</el-checkbox>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content" style="margin-left: 10px;">
          <el-checkbox v-model="filterByManager" @change="onFilterByManagerChange">Manager</el-checkbox>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2" v-if="filterByManager">
      <el-col :span="24">
        <multiselect
            :allow-empty="false"
            v-model="selectedManager"
            @select="onManagerSelect"
            :disabled="!filterByManager"
            class="multiDropdown"
            :options="employeeManagers"
            :optionsLimit="100"
            selectLabel=""
            selectedLabel=""
            deselectLabel=""
            searchable
            track-by="id"
            closeOnSelect
            label="displayName"
            placeholder="Select Manager"
          ></multiselect>
      </el-col>
    </el-row>

    <el-row :gutter="2" v-if="filterByOrg">
      <el-col :span="24">
        <div class="grid-content">
          <el-cascader
            style="width: 100%; margin-left: 0px !important"
            :disabled="!filterByOrg"
            v-model="selectedDepartmentList"
            expand-trigger="hover"
            change-on-select
            :show-all-levels="false"
            @visible-change="onCascadeVisibleChange"
            class="inputsStyles"
            placeholder="Select Department"
            :props="cascadeProps"
            :options="userDepartments">
          </el-cascader>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content-small">
          <el-checkbox @change="onCheckboxChange" class="inputsStyles" v-model="selectAll">{{checkBoxText}}</el-checkbox>
        </div>
      </el-col>
      <el-col :span="24">
        <multiselect
          @select="addSelectedEmployee"
          class="multiDropdown"
          :options="employees"
          :optionsLimit="100"
          selectLabel=""
          selectedLabel=""
          deselectLabel=""
          searchable
          track-by="id"
          closeOnSelect
          label="displayName"
          placeholder="Employees"
        ></multiselect>
      </el-col>
    </el-row>

    <el-row :gutter="2">
      <el-col :span="24">
        <div class="grid-content-tags">
          <el-tag
            :key="employee.id"
            v-for="employee in selectedEmployees"
            style="height: auto;background-color: #34495E; color: #fff;margin: 2px;"
            type='info'
            closable
            :disable-transitions="false"
            @close="removeSelectedEmployee(employee)">
            [{{employee.payrollNo}}]<br>{{employee.initials}} {{employee.surname}}
          </el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect
  },
  data: () => ({
    selectAll: false,
    cascadeProps: {
      value: 'id',
      children: 'childOrganizationDepartments',
      label: 'description'
    },
    selectedDepartmentList: [],
    selectedManager: null,
    filterByManager: false,
    filterByOrg: true
  }),
  methods: {
    onFilterByManagerChange (newVal) {
      if (!newVal) {
        this.selectedManager = null
      }
      if (newVal && this.filterByOrg) {
        this.filterByOrg = false
      }
      if (!newVal && !this.filterByOrg) {
        this.requestNewEmployees(null, null, null)
      }
    },
    onFilterByOrgChange (newVal) {
      if (!newVal) {
        this.selectedDepartmentList = []
      }
      if (newVal && this.filterByManager) {
        this.filterByManager = false
      }
      if (!newVal && !this.filterByManager) {
        this.requestNewEmployees(null, null, null)
      }
    },
    onManagerSelect (manager) {
      this.requestNewEmployees(this.filterBy, null, manager.id)
    },
    requestNewEmployees (filterType, departmentId, managerId) {
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'fetchEmployees',
        filterType,
        departmentId,
        managerId
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    onCascadeVisibleChange (visible) {
      if (visible || this.selectedDepartmentList.length === 0) {
        return
      }
      this.requestNewEmployees(this.filterBy, this.getSelectedDepartmentId, null)
    },
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    },
    removeSelectedEmployee (employee) {
      this.$store.commit({
        type: 'removeSelectedEmployee',
        employee: employee
      })
      if (this.selectedEmployees.length !== this.employees.length) {
        this.selectAll = false
      }
      // Get jobs from server
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'getPlannedEmployeeJobs'
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    addSelectedEmployee (employeeFromSelect) {
      const numSelectedEmployees = this.selectedEmployees.length
      this.$store.commit({
        type: 'addSelectedEmployee',
        employee: employeeFromSelect
      })
      if (this.selectedEmployees.length === this.employees.length) {
        this.selectAll = true
      }
      // Only if employee is added we reload
      const employeeAdded = numSelectedEmployees !== this.selectedEmployees.length
      if (employeeAdded) {
        // Get jobs from api
        this.setGlobalLoading(true)
        this.$store.dispatch({
          type: 'getPlannedEmployeeJobs'
        }).catch((error) => {
          console.log(error)
          // If an error occurred we remove the selection again
          this.$store.commit({
            type: 'removeSelectedEmployee',
            employee: employeeFromSelect
          })
          this.selectAll = false
        }).finally(() => {
          this.setGlobalLoading(false)
        })
      }
    },
    onCheckboxChange () {
      if (this.selectAll) {
        const previouslySelected = this.selectedEmployees
        const tempSelected = []
        this.employees.forEach(employee => {
          tempSelected.push(employee)
        })
        this.$store.commit({
          type: 'setSelectedEmployees',
          employees: tempSelected
        })
        // Get jobs from server
        this.setGlobalLoading(true)
        this.$store.dispatch({
          type: 'getPlannedEmployeeJobs'
        }).catch((error) => {
          console.log(error)
          // Undo the selection
          this.$store.commit({
            type: 'setSelectedEmployees',
            employees: previouslySelected
          })
          this.selectAll = false
        }).finally(() => {
          this.setGlobalLoading(false)
        })
      } else {
        // Clear the selected employees
        this.$store.commit({
          type: 'setSelectedEmployees',
          employees: []
        })
        // Clear the employee jobs
        this.$store.commit({
          type: 'setCurrentPlannedJobs',
          currentPlannedJobs: []
        })
      }
    },
    addNewJob () {
      this.$emit('add-new-job', true)
    },
    isAddButtonDisableCheck () {
      if (this.$store.getters.getSelectedEmployees.length === 0) {
        return true
      }

      let formatedDate = this.$dateHelper.helperStandardDateOnlyFormat(this.$store.getters.getSelectedTabDay)
      if (this.$editableChecker.checkIfNotEditable(formatedDate)) {
        return true
      }

      return false
    }
  },
  computed: {
    filterBy () {
      if (this.filterByManager) {
        return 'MANAGER'
      }
      if (this.filterByOrg) {
        return 'DEPARTMENT'
      }
      return null
    },
    getSelectedDepartmentId () {
      return this.selectedDepartmentList[this.selectedDepartmentList.length - 1]
    },
    selectedEmployees () {
      return this.$store.getters.getSelectedEmployees
    },
    employees () {
      return this.$store.getters.getEmployees
    },
    employeeManagers () {
      return this.$store.getters.getEmployeeManagers
    },
    checkBoxText () {
      if (this.selectAll) {
        return 'Unselect All'
      }
      return 'Select All'
    },
    userDepartments () {
      return this.$store.getters.getUserDepartments
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 2px;
  position: relative;
}

.grid-content{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
}

.inputsStyles {
  margin-left: 10px;
}

.inputsStyles.el-checkbox {
  z-index: 0 !important;
}

.grid-content-small {
  width: 100%;
  height: 40px;
  line-height: 50px;
  text-align: left;
}

.grid-content-tags {
  margin-top: 10px;
  min-height: 50px;
  margin-left: auto;
  margin-right: auto;
  max-height: 50vh;
  width: 95%;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 7px;
  padding: 5px;
  background: #5D6D7E;
  height: auto;
}

.multiDropdown {
  margin-top: 5px;
  margin-bottom: 5px;
}

</style>

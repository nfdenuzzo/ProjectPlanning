<template>
  <div class="heading">
    <el-row :gutter="2">
      <el-col :span="3">
        <div class="grid-content-top">Week Ending</div>
      </el-col>
      <el-col :span="3" v-for="(item, index) in tabDays" :key="index">
        <div @click="selectTabItem(item.day)" :class="isTabSelected(item.day) ? validateDate(item.day) + ' grid-content-top noselect grid-content-top-bg-selected ' : validateDate(item.day) + ' grid-content-top noselect grid-content-top-bg'">{{formatDate(item.day)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <div class="grid-content grid-content-bg">
          <el-date-picker
            @change="onDatePickerChange"
            style="width: 90%;margin: 0px 5%;height: 100%;"
            type="date"
            size="mini"
            :clearable="false"
            v-model="selectedWeekEndingDate"
            placeholder="Pick a day">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="3" v-for="(item, index) in tabDays" :key="index">
        <div @click="selectTabItem(item.day)" :class="isTabSelected(item.day, false) ? 'grid-content noselect grid-content-bg-selected ' : 'grid-content noselect grid-content-bg'">{{WeekDaySortName(item.day)}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <div class="grid-content-min grid-content-min-bg">
          Total Hours
        </div>
      </el-col>
      <el-col :span="3" v-for="(item, index) in tabDays" :key="index">
        <div @click="selectTabItem(item.day)" class="grid-content-min grid-content-min-bg" :class="isTabSelected(item.day, false) ? 'grid-content noselect grid-content-bg-selected ' : 'grid-content noselect grid-content-bg'">{{item.dayTotal}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'heading',
  data () {
    return {
      selectedWeekEndingDate: new Date()
    }
  },
  methods: {
    validateDate (date, top) {
      if (this.$editableChecker.checkIfNotEditable(date)) {
        return 'disable'
      }
      return ''
    },
    isTabSelected (selectedDay) {
      return this.$dateHelper.helperIsSameDay(selectedDay, this.selectedTabDay)
    },
    onDatePickerChange () {
      const previousTabDay = this.selectedTabDay
      const previousTabDays = this.tabDays
      const previousJobs = this.currentPlannedJobs
      this.$store.commit({
        type: 'setTabDays',
        weekEndingDate: this.selectedWeekEndingDate
      })
      // Clear the employee jobs
      this.$store.commit({
        type: 'setCurrentPlannedJobs',
        currentPlannedJobs: []
      })
      // Get the new jobs
      this.getPlannedEmployeeJobs(previousTabDay, previousJobs, previousTabDays)
    },
    formatDate (date) {
      return this.$dateHelper.helperGetDayNameWording(date)
    },
    WeekDaySortName (date) {
      return this.$dateHelper.helperGetWeekDaySortName(date)
    },
    selectTabItem (day) {
      const previousJobs = this.currentPlannedJobs
      const previousTabDay = this.selectedTabDay
      this.$store.commit({
        type: 'setSelectedTabDay',
        day
      })
      this.getPlannedEmployeeJobs(previousTabDay, previousJobs, null)
    },
    getPlannedEmployeeJobs (previousDate, previousJobs, previousTabDays) {
      this.setGlobalLoading(true)
      this.$store.dispatch({
        type: 'getPlannedEmployeeJobs'
      }).catch((error) => {
        console.log(error)
        // Revert the tab days if necessary
        if (previousTabDays && previousTabDays.length > 0) {
          this.$store.commit({
            type: 'overrideTabDays',
            tabDays: previousTabDays
          })
        }
        // Revert the selected date, always
        this.$store.commit({
          type: 'setSelectedTabDay',
          day: previousDate
        })
        // Revert the current planned jobs, always
        this.$store.commit({
          type: 'setCurrentPlannedJobs',
          currentPlannedJobs: previousJobs
        })
      }).finally(() => {
        this.setGlobalLoading(false)
      })
    },
    setGlobalLoading (loading) {
      this.$store.commit({
        type: 'setGlobalLoad',
        load: loading
      })
    }
  },
  computed: {
    tabDays () {
      return this.$store.getters.getTabDays
    },
    selectedTabDay () {
      return this.$store.getters.getSelectedTabDay
    },
    selectedEmployees () {
      return this.$store.getters.getSelectedEmployees
    },
    currentPlannedJobs () {
      return this.$store.getters.getCurrentPlannedJobs
    }
  }
}
</script>

<style scoped>
  .el-row {
    position: relative;
  }

  .disable {
    background: #AEB6BF !important;
  }

  .grid-content-top {
    margin-top: 15px;
    min-height: 2.5vw;
    line-height: 2.3vw;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    font-size: 1.15vw;
    color: #1C2833;
  }

  .grid-content-top:hover{
    cursor: pointer;
  }

  .grid-content {
    min-height: 2.5vw;
    line-height: 2.3vw;
    font-size: 1vw;
    color: #fff;
  }

  .grid-content:hover{
    cursor: pointer;
  }

  .grid-content-top-bg {
    background: #E6A23C;
  }

  .grid-content-top-bg-selected {
    background: #409EFF;
    color: #fff;
  }

  .grid-content-bg {
    background: #5D6D7E;
  }

  .grid-content-bg-selected {
    background: #2E85C0;
    color: #fff;
  }

  .grid-content-top-bg-clear {
    background: transparent;
  }

  .grid-content-min{
    min-height: 30px;
    line-height: 30px;
    font-size: 1vw;
    color: #fff;
  }

  .grid-content-min-bg{
    background: #46525F;
  }

  .noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>

<template>
  <div class="aa">
    <div ref="asd" class="ww"></div>
    <div ref="gender" class="ww"></div>
    <div class="ww">占位</div>
  </div>
  <div>
    <div class="qq" ref="age">占位</div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import student from '../utils/admin'
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'

const asd = ref<any>(null)
const mysss = <any>null
const gender = ref<any>(null)
const genders = <any>null
const age = ref<any>(null)
const ages = <any>null
onMounted(async () => {
  const res = await student.get('student/statistics')
  console.log(res.data)

  const mysss = echarts.init(asd.value)
  const option = {
    title: {
      text: '系统中的整体统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['统计'],
      bottom: 10,
    },

    xAxis: {
      type: 'category',
      data: ['用户数量', '学生数量'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '统计',
        type: 'bar',
        data: [res.data.user, res.data.student],
        itemStyle: {
          color: '#5470C6',
        },
      },
    ],
  }
  const genders = echarts.init(gender.value)
  const genderOption = {
    tooltip: {
      trigger: 'axis',
    },
    title: {
      text: '学生男女总人数',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: ['男生', '女生'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [res.data.boy, res.data.girl],
        type: 'bar',
      },
    ],
  }
  const ages = echarts.init(age.value)
  const ageOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  }
  ages.setOption(ageOption)
  genders.setOption(genderOption)
  mysss.setOption(option)
})

onBeforeUnmount(() => {
  if (mysss) {
    mysss.dispose()
  }
  if (genders) {
    genders.dispose()
  }
})
</script>

<style>
.aa {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.ww {
  flex: 1;
  min-width: 0;
  height: 400px;
}
.qq {
  height: 400px;
}
</style>

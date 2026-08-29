<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :current-page="page"
    :page-size="limit"
    @current-change="changPage"
  />
</template>

<script setup>
import { ElPagination } from 'element-plus'

defineProps({
  page: Number,
  limit: Number,
  total: Number,
})//子组件用于触发父组件的函数defineEmits   将要向父组件触发的事件封装成变量
const emit = defineEmits(['pageChange'])
const changPage = (newpage) => {
  emit('pageChange', newpage)
}
</script>

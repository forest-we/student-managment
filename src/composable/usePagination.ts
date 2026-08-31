import { ref } from 'vue'

export function usePagination() {
  const total = ref(0)
  const limit = ref(5)
  const page = ref(1)
  return {
    total,
    limit,
    page,
  }
}

export default usePagination

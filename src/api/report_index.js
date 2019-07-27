import axios from '@/utils/myaxios.js'

export const getlist = () => {
  return axios({
    url: `reports/type/1`
  })
}

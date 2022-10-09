// 主要获取品牌管理数据模块
import requests from '@/utils/request'
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => requests({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增品牌 /admin/product/baseTrademark/save post
// 修改 /admin/product/baseTrademark/update  put  需要id
export const reqAddOrUpdateTradeMark = (trademark) => {
  if (trademark.id) {
    return requests({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: trademark
    })
  } else {
    return requests({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: trademark
    })
  }
}

// 删除品牌 DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => {
  return requests({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'DELETE'
  })
}

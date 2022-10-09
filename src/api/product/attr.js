// 平台属性管理模块
import requests from '@/utils/request'

// 一级分类  /admin/product/getCategory1 get
export const reqCategory1List = () => {
  return requests({
    url: '/admin/product/getCategory1',
    method: 'get'
  })
}
// 二级分类 /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => {
  return requests({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })
}
// 三级分类 /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => {
  return requests({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })
}
// 详细数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => {
  return requests({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}
// 添加属性与属性值 /admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data) => {
  return requests({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
  })
}

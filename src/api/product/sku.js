// sku模块
import requests from '@/utils/request'

// 获取图片的接口 /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => {
  return requests({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
}

// 获取销售属性 /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => {
  return requests({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
}

// 获取平台属性  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return requests({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

// 保存提交sku /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => requests({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取sku列表数据 /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => {
  return requests({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
  })
}
// ---------------------------------------------------------
// SKU
// 获取SKU 列表 /admin/product/list/{page}/{limit}
export const reqSKUList = (page, limit) => {
  return requests({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })
}

// 上架  /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => {
  return requests({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
  })
}
// 下架  /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => {
  return requests({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })
}

// sku详情  /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => {
  return requests({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
  })
}

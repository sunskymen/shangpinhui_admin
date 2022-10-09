// spu模块
import requests from '@/utils/request'

// 获取spu列表 /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => requests({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// 获取spu信息 /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => requests({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌数据信息 /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => requests({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// spu图片  /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => requests({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台全部销售属性  /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => requests({ url: 'admin/product/baseSaleAttrList', method: 'get' })

// 添加 修改 spu, 区别 有无id
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return requests({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    // 不带id 添加spu
    return requests({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 删除spu /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => requests({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

export function fetchGoodsCategory(goodsCategories, product, value) {
  if (goodsCategories) {
    goodsCategories.forEach( goodsCategory => {
      product.bigCategoryName = goodsCategories.find((item) => {
        return item.id === value[0]
      }).name
      if (goodsCategory.children) {
        goodsCategory.children.forEach( children1 => {
          if(children1.id === value[1]){
            product.middleCategoryName = children1.name;
          }
          if (children1.children) {
            children1.children.forEach( children2 => {
              if(children2.id === value[2]){
                product.littleCategoryName = children2.name;
              }
              if (children2.children) {
                children2.children = null
              }
            })
          }
        })
      }
    })
    return product;
  }
}

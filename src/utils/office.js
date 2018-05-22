import fetch from 'utils/fetch';

export function fetchOffice(offices,machine,value) {
  if (offices) {
    offices.forEach( office => {
      machine.companyName = offices.find((item) => {
        return item.id === value[0]
      }).name
      if (office.children) {
        office.children.forEach( children1 => {
          if(children1.id === value[1]){
            machine.regionName = children1.name;
          }
          if (children1.children) {
            children1.children.forEach( children2 => {
              if(children2.id === value[2]){
                machine.officeName = children2.name;
                machine.preAddress = children2.attributes.countryName+children2.attributes.provinceName+children2.attributes.cityName
              }
              if (children2.children) {
                children2.children = null
              }
            })
          }
        })
      }
    })
    return machine;
  }
}

export function fetchOffice2(offices,branch,value) {
  if (offices) {
    offices.forEach( office => {
      branch.compName = offices.find((item) => {
        return item.id === value[0]
      }).name
      if (office.children) {
        office.children.forEach( children1 => {
          if(children1.id === value[1]){
            branch.regionName = children1.name;
          }
          if (children1.children) {
            children1.children.forEach( children2 => {
              if(children2.id === value[2]){
                branch.officeName = children2.name;
              }
              if (children2.children) {
                children2.children = null
              }
            })
          }
        })
      }
    })
    return branch;
  }
}


export function fetchOfficeCarouselMap(offices,carouselMaps,value) {
  if (offices) {
    offices.forEach( office => {
      carouselMaps.companyName = offices.find((item) => {
        return item.id === value[0]
      }).name
      console.log("office==="+JSON.stringify(office))
      if (office.children) {
        office.children.forEach( children1 => {
          if(children1.id === value[1]){
            carouselMaps.regionName = children1.name;
          }
        })
      }
    })
    return carouselMaps;
  }
}

/*export function fetchOfficeCarouselMap(offices,carouselMaps,value) {
  if (offices) {
    console.log("offices==="+JSON.stringify(offices))
    offices.forEach( office => {
      carouselMaps.companyName = offices.find((item) => {
        return item.id === value[0]
      }).name
      if (office.children) {
        office.children.forEach( children1 => {
          if(children1.id === value[1]){
            carouselMaps.regionName = children1.name;
          }
          if (children1.children) {
            children1.children.forEach( children2 => {
              if(children2.id === value[2]){
                carouselMaps.officeName = children2.name;
              }
              if (children2.children) {
                children2.children = null
              }
            })
          }
        })
      }
    })
    console.log("carouselMaps==="+JSON.stringify(carouselMaps))
    return carouselMaps;
  }
}*/


export function fetchOfficeImageTemplate(offices) {
  var officeLists = [];
  if (offices) {
    for(var i = 0; i<offices.children.length; i++){
      var office = { "id": offices.children[i].id, "pid": offices.children[i].pid,'name': offices.children[i].name,"attrattributes":offices.children[i].attrattributes,"children":offices.children[i].children};
      if (office.children){
        for(var n = 0; n<office.children.length; n++){
          office.children[n].children = undefined;
        }
      }
      officeLists.push(office)
    }
  }
  return officeLists;
}


export function fetchOfficeStockInfo(offices,stockInfos,value) {
  if (offices) {
    offices.forEach( office => {
      stockInfos.companyName = offices.find((item) => {
        return item.id === value[0]
      }).name
      if (office.children) {
        office.children.forEach( children1 => {
          if(children1.id === value[1]){
            stockInfos.regionName = children1.name;
          }
          if (children1.children) {
            children1.children.forEach( children2 => {
              if(children2.id === value[2]){
                stockInfos.officeName = children2.name;
                stockInfos.preAddress = children2.attributes.countryName+children2.attributes.provinceName+children2.attributes.cityName
              }
              if (children2.children) {
                children2.children = null
              }
            })
          }
        })
      }
    })
    return stockInfos;
  }
}

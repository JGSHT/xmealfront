import store from "../store";

export function isHasPermission(menus){
      const permissionMenus = store.getters.menus;
      //console.log(menus)
      //hasPermission(menus,permissionMenus);
      if (menus != null){
        var permission = "";
        for(var i=1;i<permissionMenus.length;i++){
          permission += permissionMenus[i]+",";
        }
       // console.log((permission.indexOf(menus) >= 0))
        return  (permission.indexOf(menus) >= 0);
      }else {
        return false;
      }
}

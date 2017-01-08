(function () {
  'use strict';

  angular.module('RestaurantApp', [])
          .controller('NarrowItDownController', NarrowItDownController)
          .service('MenuSearchService', MenuSearchService)
          .directive('foundItems', FoundItems)
          .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];

  function NarrowItDownController (MenuSearchService) {
    var narrowCtrl = this;

    narrowCtrl.narrow = function (searchTerm) {
      narrowCtrl.found = [];

      if (!searchTerm || searchTerm.length === 0 || !searchTerm.trim) {
        narrowCtrl.errorMessage = "Nothing found";
      } else {
        var narrowPromise = MenuSearchService.getMatchedMenuItems(searchTerm);

        narrowPromise.then(function (response) {
          if(response.length == 0) {
            narrowCtrl.found = [];
            narrowCtrl.errorMessage = "Nothing found";
          } else {
            narrowCtrl.found = response;
            narrowCtrl.errorMessage = "";
          }
        }).catch(function (error) {
          console.log("SOMETHING WENT WRONG");
        });
      }
    };

    narrowCtrl.removeItem = function (index) {
      narrowCtrl.found.splice(index, 1);
    };
  }

  function MenuSearchService ($http, ApiBasePath) {
    var menuService = this;
    var foundItems = [];

    menuService.getMatchedMenuItems = function (searchTerm) {
      var matchedMenuItems = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (response) {
        var menu = response.data.menu_items;
        menuService.matchMenu(menu, searchTerm);
        return foundItems;
      });

      return matchedMenuItems;
    };

    menuService.matchMenu = function (menu, searchTerm) {
      foundItems = [];

      for(var i = 0; i < menu.length; i++) {
        if(menu[i].description.indexOf(searchTerm) !== -1) {
          foundItems.push(menu[i]);
        }
      }

      return foundItems;
    };
  }

  function FoundItems () {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'foundItemsDirective',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController () {
    var foundCtrl = this;
  }

})();

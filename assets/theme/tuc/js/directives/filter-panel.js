uvodApp.directive('filterPanel', function() {
    return {
        scope: {
            fields: '=',
            dtFrom: '=',
            dtTo: '=',
            getPage: '&getPageAttr',
            page : '=pageAttr',
            filterList : '=filterListAttr'
        },
        link : function(scope, elem, attrs) {

            scope.filterItems = {};

             //Apply filters and reload the results
             scope.applyFilter = function(category, itemId, value) {

                if (value) {

                    if (!(category in scope.filterItems)) {
                        scope.filterItems[category] = [];
                    }

                    if (!(itemId in scope.filterItems[category])) {
                        scope.filterItems[category].push(itemId);
                    }

                } else {

                    //Get index of the item ID
                    var index = scope.filterItems[category].indexOf(itemId);
                    if (index > -1) {
                        //Remove the item ID from the category array
                        scope.filterItems[category].splice(index, 1);

    
                        //Remove the category array if it's empty
                        if (scope.filterItems[category].length === 0) {
                            delete scope.filterItems[category];
                        }
                        
                    }
                }

                scope.filterList = {};

                //Set the filter object
                for (var key in scope.filterItems) {
                    var newKey = key.replace('identity','identities');
                    scope.filterList[newKey + ".id"] = "";
                    for (var i = 0; i < scope.filterItems[key].length; i++) {
                        if(i !== 0){
                            scope.filterList[ney + ".id"] += '|';
                        }
                        scope.filterList[newKey + ".id"] += scope.filterItems[key][i];
                        
                    }
                    
                    
                }

                scope.getPage({ pageArg: scope.page});
            }
            scope.applyFilterDate = function() {


                scope.getPage({ pageArg: scope.page});
            }

        },
        controller: ['$scope','globalFactory', function filterPanelController($scope, globalFactory) {

            globalFactory.getMainMenu().then(function(data) {
                $scope.filters = data;
            });

            $scope.showFilter = function(element){

                var show = false;
                for (var i = 0; i < $scope.fields.length; i++) {
                    if($scope.fields[i] == element){
                        show = true;
                    }    
                    
                }
                return show;
            }

           
        }],
        templateUrl: '/assets/theme/tuc/html/directives/filter-panel.html'
    };
});
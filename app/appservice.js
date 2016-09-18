var apis = angular.module('onePushAPIs', []);
apis.factory('GetPortfolio', function ($http, $q) {
    return {
        get: _fetchData,
        push : _saveData
    }

    function _fetchData(handleSuccess, handleError) {
        console.log("Inside fetch data");
        var request = $http({
            url: "https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites",
            method: 'GET',
            data: null
        });
        /*request.success(function (data) {
            return data;
        });
        request.error(function (err) {
            console.error(err);
        })*/
        request.then(handleSuccess, handleError);
    }
    
    function _saveData(handleSuccess,handleError,reqObj){
        console.log("saveData");
        var request = $http({
           url : 'https://hackerearth.0x10.info/api/one-push?type=json&query=push',
            method : 'GET',
            data : null,
            params : reqObj
        });
        
        request.then(handleSuccess,handleError,reqObj);
    }
    
    //success handler
    function handleSuccess(response) {
        var deferred = $q.defer();
        try {
            if (!angular.isObject(response.data)) {
                throw "No records found";
            }
            deferred.resolve(response.data);
            return deferred.promise;
        }
        catch (error) {
            $log.log(error);
        }
    }

    //failure handler
    function handleError(response) {
        try {
            if (!angular.isObject(response.data) || !response.data.message) {
                return ($q.reject("An unknown error occurred."));
            }
            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));
        }
        catch (error) {
            $log.log(error);
        }
    }
});
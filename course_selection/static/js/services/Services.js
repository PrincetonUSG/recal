define(["require", "exports", './ResourceBuilder', "angular"], function(require, exports, ResourceBuilder) {
    var niceServices = angular.module('niceServices', []);

    niceServices.factory('ResourceBuilder', ['$resource', 'localStorageService', function ($resource, localStorageService) {
            return new ResourceBuilder($resource, localStorageService);
        }]);

    niceServices.factory('ScheduleResource', ["ResourceBuilder", function (builder) {
            return builder.getScheduleResource();
        }]);
    niceServices.factory('CourseResource', ["ResourceBuilder", function (builder) {
            return builder.getCourseResource();
        }]);
    niceServices.factory('ColorResource', ["ResourceBuilder", function (builder) {
            return builder.getColorResource();
        }]);
    niceServices.factory('UserService', ['ResourceBuilder', function (builder) {
            return builder.getUserService();
        }]);

    
    return niceServices;
});
//# sourceMappingURL=Services.js.map
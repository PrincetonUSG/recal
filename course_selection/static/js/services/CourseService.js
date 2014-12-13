/// <reference path='../../../../nice/static/ts/typings/tsd.d.ts' />
define(["require", "exports"], function(require, exports) {
    'use strict';

    var CourseService = (function () {
        function CourseService($q, localStorageService, courseResource) {
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.courseResource = courseResource;
        }
        CourseService.prototype.getBySemester = function (termCode) {
            var _this = this;
            var temp = this.localStorageService.get('courses-' + termCode);
            if (temp != null && Array.isArray(temp)) {
                return this.$q.when(temp);
            } else {
                var promise = this.courseResource.getBySemester({ semester__term_code: termCode });
                promise.then(function (data) {
                    _this.localStorageService.set('courses-' + termCode, data);
                });
                return promise;
            }
        };
        CourseService.$inject = [
            '$q',
            'localStorageService',
            'CourseResource'
        ];
        return CourseService;
    })();

    
    return CourseService;
});

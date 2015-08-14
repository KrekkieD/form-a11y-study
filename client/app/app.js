(function () {
    'use strict';

    angular.module('test.app', ['ngMaterial', 'ngMessages']);

    angular.module('test.app')
        .directive('testAppForm', function () {

            return {
                restrict: 'A',
                controllerAs: 'form',
                controller: Controller
            };

            function Controller () {

                var self = this;

                self.submit = submit;

                function submit (form) {

                    console.log(form);
                    return false;

                }

            }

        });


}());

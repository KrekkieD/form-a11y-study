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

            function Controller ($timeout) {

                var self = this;

                self.submit = submit;

                function submit (form) {

                    console.log('submitting');
                    console.log(form);
                    if (!form.$valid) {

                        $timeout(function () {

                            document.getElementById('errors').focus();

                            var elementList = document.querySelectorAll('#errors a');

                            Object.keys(elementList).forEach(function (elKey) {

                                var el = elementList[elKey];

                                el.addEventListener('click', function (e) {

                                    e.preventDefault();
                                    document.getElementById(el.getAttribute('data-element-id')).focus();

                                });

                            });

                        });


                    }
                    return false;

                }

            }

        });


}());

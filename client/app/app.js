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

            function Controller ($timeout, $element, $scope) {

                var submitting = false;
                var validityWatchers = [];

                var self = this;

                self.model = {};

                self.submit = submit;
                self.setTabIndex = setTabIndex;

                function submit (form) {

                    console.log(form);

                    if (submitting) { return; }

                    // first reset all non-blocking errors to valid
                    form.$setValidity('internalservererror', true);
                    form.$setValidity('accounttoosimilar', true);
                    form.phone.$setValidity('phonenotrecognized', true);
                    form.address.$setValidity('addressnotrecognized', true);


                    if (!form.$valid) {

                        document.getElementById('errors').focus();

                    }
                    else {

                        submitting = true;

                        // remove any existing watchers
                        while (validityWatchers.length) {
                            validityWatchers.pop()();
                        }

                        $timeout(function () {

                            self.model.error = self.model.error || {};

                            if (self.model.error.internalservererror) {
                                form.$setValidity('internalservererror', false);
                            }
                            else if (self.model.error.accounttoosimilar) {
                                form.$setValidity('accounttoosimilar', false);
                            }
                            else {
                                if (self.model.error.emailinuse) {

                                    form.email.$setValidity('emailinuse', false);
                                    var invalidEmailValue = self.model.email;

                                    validityWatchers.push($scope.$watch('form.model.email', function (newEmailValue) {
                                        if (invalidEmailValue === newEmailValue) {
                                            form.email.$setValidity('emailinuse', false);
                                        }
                                        else {
                                            form.email.$setValidity('emailinuse', true);
                                        }
                                    }));

                                }
                                if (self.model.error.phonenotrecognized) {

                                    form.phone.$setValidity('phonenotrecognized', false);

                                }
                                if (self.model.error.addressnotrecognized) {

                                    form.address.$setValidity('addressnotrecognized', false);

                                }
                            }

                            if (form.$valid === false) {
                                $timeout(function () {
                                    document.getElementById('errors').focus();
                                });
                            }


                            submitting = false;

                        }, 1500);

                    }

                }

                function setTabIndex () {

                    // todo: need to find a clean way to mark form subsections as invalid 
                    //  and to include those fields in the tab flow, even though fields are not marked
                    //  with aria-invalid

                    // set tabindex on the form
                    var elementList = $element[0].querySelectorAll('input[tabindex], [ng-form].ng-invalid');

                    var firstElement;

                    for (var key in elementList) {
                        if (elementList.hasOwnProperty(key)) {

                            var element = elementList[key];

                            // remove ability to tab to valid form fields
                            var tabIndex = '-1';

                            // todo: might be better to look for aria-invalid?
                            if (element.className.match(/(^|\s)ng-invalid(\s|$)/) ||
                                element.getAttribute('ng-messages') !== null) {
                                // if field is invalid, tabIndex should be reset to '0'
                                tabIndex = '0';

                                if (typeof firstElement === 'undefined') {
                                    firstElement = element;
                                }
                            }

                            element.setAttribute('tabindex', tabIndex);

                        }
                    }

                    firstElement.focus();

                }

                function restoreTabIndex () {

                }

            }

        });


}());

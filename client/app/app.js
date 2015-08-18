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

                self.tabIndexOn;
                self.model = {};

                self.submit = submit;
                self.toggleTabIndex = toggleTabIndex;

                function submit (form) {

                    if (submitting) { return; }

                    if (self.tabIndexOn === true) {
                        toggleTabIndex(true);
                    }

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

                                    form.basic.email.$setValidity('emailinuse', false);
                                    var invalidEmailValue = self.model.email;

                                    validityWatchers.push($scope.$watch('form.model.email', function (newEmailValue) {
                                        if (invalidEmailValue === newEmailValue) {
                                            form.basic.email.$setValidity('emailinuse', false);
                                        }
                                        else {
                                            form.basic.email.$setValidity('emailinuse', true);
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

                function toggleTabIndex (reset) {

                    if (reset || self.tabIndexOn) {
                        restoreTabIndex();
                        $element[0].removeEventListener('keydown', _keyListener, false);
                        self.tabIndexOn = reset ? undefined : false;
                    }
                    else {
                        setTabIndex();
                        $element[0].addEventListener('keydown', _keyListener, false);
                        self.tabIndexOn = true;
                    }

                }

                function _keyListener (e) {

                    if (e.keyCode === 27) {
                        $scope.$apply(toggleTabIndex);
                    }

                }

                function setTabIndex () {

                    // basic logic:
                    // - any invalid form's directly descending inputs having aria-invalid will get tab indices
                    // - any invalid form without inputs having aria-invalid but with an error showing will get tab indices on all inputs

                    // find all elements marked with aria-invalid
                    var inputElementsArray = _query('[aria-invalid]', $element[0]);

                    // set tabindex to -1 on all inputs to create a base starting point
                    _setTabIndex(inputElementsArray, '-1');

                    // get all invalid forms and force to array
                    var formElements = _query('[ng-form].ng-invalid', $element[0]);

                    // add the current form to it
                    formElements.unshift($element[0]);


                    // keep track of the first element that will need to be focused on.
                    // - this should not be the parent form itself, we're already focused on one of its child nodes
                    // - this could be an [ng-form] if it has tabindex and no inputs marked aria-invalid="true"
                    var firstElement;

                    for (var i = 0, iMax = formElements.length; i < iMax; i++) {

                        // get [aria-invalid] elements in current form
                        var formInputsArray = _query('[aria-invalid]', formElements[i]);

                        // remove any inputs from nested forms
                        _scopeFormElements(formInputsArray, formElements[i]);

                        // collection of aria-invalid="true" inputs
                        var invalidInputsArray = [];

                        // collection of not aria-invalid="true" inputs
                        var validInputsArray = [];

                        // sort the inputs based on aria-invalid value
                        for (var j = 0, jMax = formInputsArray.length; j < jMax; j++) {

                            if (formInputsArray[j].getAttribute('aria-invalid') === 'true') {
                                invalidInputsArray.push(formInputsArray[j]);
                            }
                            else {
                                validInputsArray.push(formInputsArray[j]);
                            }

                        }

                        if (invalidInputsArray.length) {
                            // form has invalid inputs

                            firstElement = firstElement || invalidInputsArray[0];

                            // reset tabindex for invalid inputs
                            _setTabIndex(invalidInputsArray, '0');

                        }
                        else {
                            // form does not have invalid inputs

                            // does form have invalid ng-forms? we then assume this parent form is fine, since no invalid inputs
                            // todo: this may need finetuning but increases complexity

                            // get all form error messages
                            var formErrorMessages = _query('[ng-messages]', formElements[i]);

                            // make sure they're not from nested forms
                            _scopeFormElements(formErrorMessages, formElements[i]);

                            if (formErrorMessages.length) {

                                // form itself may need to receive focus if it has a tabindex
                                if (formElements[i].getAttribute('tabindex') !== null) {
                                    _setTabIndex(formElements[i], '0');
                                    firstElement = firstElement || formElements[i];
                                }

                                // all these form inputs should receive a tab index
                                _setTabIndex(validInputsArray, '0');

                            }

                        }

                    }

                    if (firstElement) {
                        // this should always be present really..
                        // set focus on first element with tabindex
                        firstElement.focus();
                    }

                }

                function _setTabIndex (el, tabIndex) {

                    if (Array.isArray(el)) {
                        for (var i = 0, iMax = el.length; i < iMax; i++) {
                            _setTabIndex(el[i], tabIndex);
                        }
                    }
                    else {
                        if (el.getAttribute('data-previous-tabindex') === null) {
                            el.setAttribute('data-previous-tabindex', el.getAttribute('tabindex') || '0');
                        }
                        el.setAttribute('tabindex', tabIndex);
                    }

                }

                function _query(cssQuery, parent) {

                    parent = parent || document;

                    return Array.prototype.slice.call(parent.querySelectorAll(cssQuery));

                }

                function _scopeFormElements (sourceList, formElement) {

                    var newSourceList = [];

                    for (var i = 0, iMax = sourceList.length; i < iMax; i++) {

                        var subject = sourceList[i];
                        var currentSubject = sourceList[i];

                        while (currentSubject !== formElement &&
                            currentSubject.parentNode) {

                            if (currentSubject.parentNode === formElement) {

                                // traveled up and found the right parent! add to source list
                                newSourceList.push(subject);

                                // break to next for-iteration
                                break;

                            }
                            else if (currentSubject.parentNode.getAttribute('ng-form') !== null ||
                                currentSubject.parentNode.getAttribute('data-ng-form') !== null) {

                                // Parent is a sub form. Should not add input to source list.
                                // break to next for-iteration
                                break;
                            }
                            else {
                                // update currentSubject and reiterate
                                currentSubject = currentSubject.parentNode;
                            }

                        }

                    }

                    sourceList.length = 0;
                    Array.prototype.push.apply(sourceList, newSourceList);

                }

                function restoreTabIndex () {

                    var adjustedInputs = _query('[data-previous-tabindex]', $element[0]);

                    for (var i = 0, iMax = adjustedInputs.length; i < iMax; i++) {
                        adjustedInputs[i].setAttribute('tabindex', adjustedInputs[i].getAttribute('data-previous-tabindex'));
                        adjustedInputs[i].removeAttribute('data-previous-tabindex');
                    }

                }

            }

        });


}());

var Triarc;
(function (Triarc) {
    var PageLock;
    (function (PageLock) {
        var Modal = Triarc.Web.Modal;
        var PageLockService = (function () {
            function PageLockService($browser, $state, $location, $rootScope, $filter, $modal) {
                var _this = this;
                this.$browser = $browser;
                this.$state = $state;
                this.$location = $location;
                this.$rootScope = $rootScope;
                this.$filter = $filter;
                this.$modal = $modal;
                this.$rootScope.$on("$stateChangeStart", function (event, next, current) {
                    if (_this.promiseLock) {
                        event.preventDefault();
                        Modal.openConfirmModal(_this.$filter('translate')(_this.promiseLockConfirmMessage), _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.releaseBlockNavigation();
                                if (Triarc.hasValue(_this.watchRegistration)) {
                                    _this.watchRegistration();
                                }
                                if (Triarc.hasValue(_this.watchDirtyFormVar)) {
                                }
                                console.log(_this.buttonLock);
                                _this.$state.transitionTo(next);
                            }
                        }, angular.noop);
                    }
                    if (_this.watchMeLock) {
                        event.preventDefault();
                        Modal.openConfirmModal(_this.$filter('translate')(_this.watchMeLockConfirmMessage), _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.stopWatchingMe();
                                _this.$state.transitionTo(next);
                            }
                        }, angular.noop);
                    }
                    if (_this.watchDirtyFormVar && _this.form.$dirty) {
                        event.preventDefault();
                        Modal.openConfirmModal(_this.watchFormLockConfirmMessage, _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.stopWatchingDirtyForm();
                                _this.$state.transitionTo(next);
                            }
                        }, angular.noop);
                    }
                });
            }
            PageLockService.prototype.blockNavigation = function (toasterMessage, promise, confirmationMessage) {
                var _this = this;
                if (confirmationMessage === void 0) { confirmationMessage = "_defaultOperationNotFinishedMessage"; }
                this.buttonLock = this.promiseLock = true;
                this.promiseLockConfirmMessage = this.$filter('translate')(confirmationMessage);
                this.inProgressToaster(this.$filter('translate')(toasterMessage));
                var update = function () {
                    _this.buttonLock = _this.promiseLock = false, _this.clearToaster();
                };
                promise.then(update, update);
                return promise;
            };
            PageLockService.prototype.showToaster = function (toasterMessage, promise) {
                var toast = this.createToastr(this.$filter('translate')(toasterMessage));
                promise.finally(function () {
                    toastr.clear(toast);
                });
            };
            PageLockService.prototype.releaseBlockNavigation = function () {
                this.promiseLock = false;
            };
            PageLockService.prototype.watchMe = function ($scope, watchValue, watchResult, message) {
                var _this = this;
                if (message === void 0) { message = "_defaultLooseDataMessage"; }
                this.watchMeLockConfirmMessage = this.$filter('translate')(message);
                this.watchRegistration = $scope.$watch(watchValue, function (newValue, oldValue) {
                    _this.watchMeLock = false;
                    if (newValue != oldValue && newValue == watchResult) {
                        _this.watchMeLock = true;
                    }
                    else if (newValue != oldValue && newValue != watchResult) {
                        _this.watchMeLock = false;
                    }
                });
                if (Triarc.hasValue(this.watchRegistration)) {
                    this.watchRegistration();
                }
            };
            PageLockService.prototype.stopWatchingMe = function () {
                this.watchMeLock = false;
                this.watchRegistration();
            };
            PageLockService.prototype.watchMyDirtyForm = function ($scope, formName, message) {
                var _this = this;
                if (message === void 0) { message = "_defaultLooseDataMessage"; }
                this.watchFormLockConfirmMessage = this.$filter('translate')(message);
                if (Triarc.hasValue(this.dirtyFormRegistration)) {
                    this.dirtyFormRegistration();
                }
                this.watchDirtyFormVar = false;
                this.watchRegistration = $scope.$watch(formName, function (form) {
                    if (Triarc.hasNoValue(form)) {
                        _this.form = form;
                        _this.watchDirtyFormVar = true;
                        _this.watchRegistration();
                    }
                    else {
                        _this.form = null;
                        _this.watchDirtyFormVar = false;
                    }
                });
            };
            PageLockService.prototype.stopWatchingDirtyForm = function () {
                if (Triarc.hasValue(this.dirtyFormRegistration)) {
                    this.dirtyFormRegistration();
                }
                this.watchDirtyFormVar = false;
                this.form = null;
            };
            PageLockService.prototype.inProgressToaster = function (message) {
                this.$waitToaster = this.createToastr(message);
            };
            PageLockService.prototype.createToastr = function (message) {
                return toastr['info'](message, "", {
                    closeButton: false,
                    debug: false,
                    positionClass: "toast-top-right",
                    tapToDismiss: false,
                    showDuration: 300,
                    hideDuration: 1000,
                    timeOut: 0,
                    extendedTimeOut: 0,
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                });
            };
            PageLockService.prototype.clearToaster = function () {
                toastr.clear(this.$waitToaster);
            };
            PageLockService.serviceId = "$pageLockService";
            PageLockService.$inject = ['$browser', '$state', '$location', '$rootScope', '$filter', '$modal'];
            return PageLockService;
        })();
        PageLock.PageLockService = PageLockService;
        angular.module("tlPageLock", ["ui.bootstrap.modal"]).service(PageLockService.serviceId, PageLockService);
    })(PageLock = Triarc.PageLock || (Triarc.PageLock = {}));
})(Triarc || (Triarc = {}));


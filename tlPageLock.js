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
                this.$locks = [];
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
                                _this.$state.transitionTo(next, current);
                            }
                        }, angular.noop);
                    }
                    if (_this.watchMeLock) {
                        event.preventDefault();
                        Modal.openConfirmModal(_this.$filter('translate')(_this.watchMeLockConfirmMessage), _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.stopWatchingMe();
                                _this.$state.transitionTo(next, current);
                            }
                        }, angular.noop);
                    }
                    if (_this.watchDirtyFormVar && _this.form.$dirty) {
                        event.preventDefault();
                        _this.buttonLock = true;
                        Modal.openConfirmModal(_this.watchFormLockConfirmMessage, _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.stopWatchingDirtyForm();
                                _this.$state.transitionTo(next, current);
                            }
                            _this.buttonLock = false;
                        }, angular.noop);
                    }
                    _this.$locks.every(function (lock) {
                        if (!lock.form[lock.field])
                            return true;
                        event.preventDefault();
                        Modal.openConfirmModal(lock.message, _this.$modal).then(function (confirm) {
                            if (confirm) {
                                _this.$locks.toEnumerable().toArray().forEach(function (l) { return l.release(); });
                                _this.$state.transitionTo(next, current);
                            }
                        });
                        return false;
                    });
                });
            }
            PageLockService.prototype.blockNavigation = function (toasterMessage, promise, confirmationMessage) {
                var _this = this;
                if (confirmationMessage === void 0) { confirmationMessage = "_defaultOperationNotFinishedMessage"; }
                this.buttonLock = this.promiseLock = true;
                this.promiseLockConfirmMessage = this.$filter('translate')(confirmationMessage);
                this.inProgressToaster(this.$filter('translate')(toasterMessage));
                var update = function () {
                    _this.buttonLock = _this.watchDirtyFormVar = _this.promiseLock = false,
                        _this.clearToaster();
                    _this.releaseBlockNavigation();
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
                    if (newValue !== oldValue && newValue === watchResult) {
                        _this.watchMeLock = true;
                    }
                    else if (newValue !== oldValue && newValue !== watchResult) {
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
            PageLockService.prototype.createFormLock = function ($scope, formName, field, message) {
                var _this = this;
                if (field === void 0) { field = "$dirty"; }
                if (message === void 0) { message = "_defaultLooseDataMessage"; }
                var unwatch = $scope.$watch(formName, function (form) {
                    if (Triarc.hasValue(form)) {
                        lock.form = form;
                        unwatch();
                    }
                    else {
                        lock.form = null;
                    }
                });
                var lock = {
                    message: this.$filter('translate')(message),
                    field: field,
                    release: function () {
                        unwatch();
                        _this.$locks.remove(lock);
                    },
                    form: null
                };
                this.$locks.add(lock);
                return lock;
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
                    if (Triarc.hasValue(form)) {
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


declare module Triarc.PageLock {
    class PageLockService {
        private $browser;
        private $state;
        private $location;
        private $rootScope;
        private $filter;
        private $modal;
        static serviceId: string;
        static $inject: string[];
        private promiseLock;
        private promiseLockConfirmMessage;
        private watchMeLock;
        private watchMeLockConfirmMessage;
        private watchRegistration;
        private watchDirtyFormVar;
        private form;
        private dirtyFormRegistration;
        private watchFormLockConfirmMessage;
        buttonLock: boolean;
        constructor($browser: any, $state: any, $location: angular.ILocationService, $rootScope: angular.IRootScopeService, $filter: angular.IFilterService, $modal: any);
        blockNavigation<T>(toasterMessage: string, promise: angular.IPromise<T>, confirmationMessage?: string): angular.IPromise<T>;
        showToaster<T>(toasterMessage: string, promise: angular.IPromise<T>): void;
        releaseBlockNavigation(): void;
        watchMe($scope: angular.IScope, watchValue: string, watchResult: any, message?: string): void;
        stopWatchingMe(): void;
        createFormLock($scope: angular.IScope, formName: string, field?: string, message?: string): IFormLock;
        watchMyDirtyForm($scope: angular.IScope, formName: string, message?: string): void;
        stopWatchingDirtyForm(): void;
        private inProgressToaster(message);
        private createToastr(message);
        private clearToaster();
        $waitToaster: JQuery;
        private $locks;
    }
    interface IFormLock {
        message: string;
        field: string;
        form: angular.IFormController;
        release(): void;
    }
}

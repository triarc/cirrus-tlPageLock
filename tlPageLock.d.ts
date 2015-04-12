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
        private watchDirtyForm;
        private form;
        private dirtyFormRegistration;
        private watchFormLockConfirmMessage;
        buttonLock: boolean;
        constructor($browser: any, $state: any, $location: ng.ILocationService, $rootScope: ng.IRootScopeService, $filter: ng.IFilterService, $modal: any);
        blockNavigation<T>(toasterMessage: string, promise: ng.IPromise<T>, confirmationMessage?: string): ng.IPromise<T>;
        showToaster<T>(toasterMessage: string, promise: ng.IPromise<T>): void;
        releaseBlockNavigation(): void;
        watchMe($scope: ng.IScope, watchValue: string, watchResult: any, message?: string): void;
        stopWatchingMe(): void;
        watchMyDirtyForm($scope: ng.IScope, formName: string, message?: string): void;
        stopWatchingDirtyForm(): void;
        private inProgressToaster(message);
        private createToastr(message);
        private clearToaster();
        $waitToaster: JQuery;
    }
}

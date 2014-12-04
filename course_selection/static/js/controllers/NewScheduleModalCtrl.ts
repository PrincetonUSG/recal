class NewScheduleModalCtrl {
    public static $inject = [
        '$scope',
        '$modalInstance'
    ];

    constructor(private $scope, private $modalInstance) {
        this.$scope.ok = () => {
            this.ok();
        };

        this.$scope.cancel = () => {
            this.cancel();
        };
    }

    public ok() {
        this.$modalInstance.close(this.$scope.newName);
    }

    public cancel() {
        this.$modalInstance.dismiss('cancel');
    }
}

export = NewScheduleModalCtrl;
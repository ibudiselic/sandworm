/**
 * @module sandworm
 * @description sandworm controllers
 */

var sandwormControllers = angular.module('sandwormControllers', [
    'ui.router',
    'ngResource',
    'ngCookies',
])
/* Admin controllers */
/** AdminLabCtrl @description displays labs */
.controller('AdminLabCtrl', ['AdminLabService', function(LabService) {
    var self = this;
    var now = Date.now();
    self.labs = LabService.query(function(labs) {
        // labs = angular.forEach(labs, function(lab) {
        //     lab.isOver = lab.end < now;
        // });
    });
    self.lab = {
        name: '',
        desc: '',
        start: new Date(),
        end: new Date()
    };
    self.submit = function() {
        console.log('Submit with ', self.lab);
    };
}])
/** LabResultsCtrl @description displays lab details for admin */
.controller('AdminLabDetailsCtrl', ['$stateParams', 'AdminLabService',
                                    function($stateParams, AdminLabService) {
    var self = this;
    self.lab = AdminLabService.get({labId: $stateParams.labId}, function(lab) {});
}])
/** AdminResultsCtrl @description displays all results on admin pages */
.controller('AdminResultsCtrl', ['$stateParams', 'AdminResultsService',
                                 function($stateParams, AdminResultsService) {
    var self = this;
    self.results = AdminResultsService.query();
}])

/* User controllers */
/** LabCtrl @description displays labs */
.controller('LabCtrl', ['LabService', function(LabService) {
    var self = this;
    var now = Date.now();
    self.labs = LabService.query(function(labs) {
        labs = angular.forEach(labs, function(lab) {
            // console.log(lab.end, now);
            // lab.isOver = angular.fromJson(lab.end) < now;
        });
    });
}])
/** LabDetailsCtrl @description displays lab details */
.controller('LabDetailsCtrl', ['$stateParams', 'LabService', function($stateParams, LabService) {
    var self = this;
    self.lab = LabService.get({labId: $stateParams.labId}, function(lab) {
        lab.isOver = lab.end < Date.now();
    });
}])
.controller('LoginCtrl', ['UserService', '$state', function(UserService, $state) {
    var self = this;
    self.userService = UserService;
    self.user = {username: '', password: ''};
    self.login = function() {
        UserService.login(self.user).then(function(success) {
            $state.go('index');
        }, function(error) {
            self.errorMessage = error.data.err;
        })
    };
    self.logout = function() {
        UserService.logout().then(function(success) {
            $state.go('index');
        }, function(error) {
            self.errorMessage = error.data.err;
        })
    };
}])
.controller('IndexCtrl', ['UserService', '$state', function(UserService, $state) {
    var self = this;
    self.userService = UserService;
    if (self.userService.isLoggedIn) {
        if (self.userService.currentUser.role == 'admin') {
            $state.go('admin-labs');
        } else {
            $state.go('labs');
        }
    } else {
        $state.go('login');
    };
}]);
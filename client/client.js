(()=>{
    const Client = angular.module("Client", []);
    const ClientSvc = function ($rootScope) {
        const svc = this;
        svc.socket = null;
        svc.connect = function(url) {
            //WebSockets is part of HTML5 API (not supported in Internet Explorer). Source: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
            svc.socket = new WebSocket(url + "/chat");
            //The function handler for onOpen is executed outside of Angular. As such, any changes to the model, Angular will not be aware.
            //Start the digest cycle and perform the update inside the cycle
            //onopen is an event
            svc.socket.onopen = () => {
                //Starting the digest cycle...
                $rootScope.$apply(()=>{
                    //Broadcasting the event....
                    $rootScope.$broadcast('Client.open');
                });
            };
            svc.socket.onmessage = (event) => {
                $rootScope.$apply(()=>{
                    $rootScope.$broadcast('Client.message', event.data);
                });
            };
            svc.send = (message) => {
                svc.socket.send(message);
            };
        };
    };
    const ClientVM = function ($scope, ClientSvc) {
        const vm = this;
        vm.chats = [];
        vm.message = "";
        vm.send = () => {
            vm.message = 
            ClientSvc.send(vm.message);
            vm.message = ""; //clears the messages after sent
        };
        //To listen to chat app opening events...
        $scope.$on("Client.open", () => {
            vm.chats.unshift("Chat connection established");
        });

        $scope.$on("Client.message", (eventObject, message) => {
            console.log(message);
            vm.chats.unshift(message);
        });

        ClientSvc.connect("ws://localhost:3000");

    };

    Client.service("ClientSvc", ["$rootScope", ClientSvc]);
    Client.controller("ClientVM", ["$scope", "ClientSvc", ClientVM]);
})();
class MyConnection {
    constructor(port) {
        this.port = port || 8081;
    }


    getPrologRequest(requestString, onSuccess, onError) {
        let requestPort = this.port /* || 8081*/;
        let request = new XMLHttpRequest();
        
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();

    }

    /*makeRequest() {
        // Get Parameter Values
        var requestString = document.querySelector("#query_field").value;

        // Make Request
        getPrologRequest(requestString, this.handleReply);
    }

    //Handle the Reply
    handleReply(data) {
        document.querySelector("#query_result").innerHTML = data.target.response;
    
    }*/

}
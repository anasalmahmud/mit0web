$(document).ready(function () {

    var table;

    // a dummy initial row for testing:
    var dataSet = [ {"order_id": "AAPL", "third_party_shipment_id": 134.28} ];
    $(document).ready(function () {
        table = $('#example').DataTable({
            data: dataSet,
            columns: [
                {title: "Order ID", data: "order_id"},
                {title: "Price", data: "third_party_shipment_id"}
            ]
        });
    });

    // small helper function for selecting element by id
    let id = id => document.getElementById(id);

    //Establish the WebSocket connection and set up event handlers
    let ws = new WebSocket("wss://test.fdll.uk/ws/third-party-order/");
    ws.onmessage = msg => updateTable(msg);
    ws.onclose = () => alert("WebSocket connection closed");

    // Add event listeners to button - this is just used to provide test input data
    id("send").addEventListener("click", () => sendAndClear(id("message").value));

    function sendAndClear(message) {
        if (message !== "") {
            ws.send(message);
            id("message").value = "";
        }
    }

    function updateTable(message) {
        let stockData = JSON.parse(message.data);
        // check if symbol already in table:
        var index = table.column( 0 ).data().indexOf( stockData.symbol );

        if (index >= 0) {
            // update the existing row:
            table.row( index ).data( stockData ).draw();
        } else {
            // insert a new row:
            table.row.add( stockData ).draw();
        }

    }

});
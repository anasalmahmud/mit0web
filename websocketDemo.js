/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    return (
        '<table style="padding-left:50px;">' +
        '<tr>' +
        '<td>FDL Label:</td>' +
        '<td>' +
        d.fdl_label +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Extra info:</td>' +
        '<td>And any further details here (images etc)...</td>' +
        '</tr>' +
        '</table>'
    );
}

$(document).ready(function () {

    var table;

    // a dummy initial row for testing:
    var dataSet = [ {"order_id": "AAPL", "third_party_shipment_id": 134.28, "fdl_label" : "hello", "third_party_code" : "DPD", "is_printed" : "True"} ];
    $(document).ready(function () {
        table = $('#example').DataTable({
            data: dataSet,
            columns: [
                {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: '',
            },
                {title: "Order ID", data: "order_id"},
                {title: "TP Tracking ID", data: "third_party_shipment_id"},
                {title: "TP LABEL", data: "third_party_code"},
                {title: "Print Info", data: "is_printed"},
            ]
        });
    });

       // Add event listener for opening and closing details

    $('#example').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

    // small helper function for selecting element by id
    let id = id => document.getElementById(id);

    //Establish the WebSocket connection and set up event handlers
    let ws = new WebSocket("wss://test.fdll.uk/ws/third-party-order/");
    ws.onmessage = msg => updateTable(msg);
    ws.onclose = () => alert("WebSocket connection closed");

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

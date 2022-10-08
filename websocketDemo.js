function SendData(send_data) {

    const socket = new WebSocket('ws://localhost:8000');

    socket.addEventListener('open', function (event) {

    socket.send(send_data);

});
}

/* Formatting function for row details - modify as you need */
function format(d) {
    let html = "";
    html += '<table style="padding-left:50px;">';
    html += "<tr>";
    html += "<td> <a class='button is-primary is-small' href='" + d.fdl_label +"'>View FDL</a> </td>";
    html += "<td> <a class='button is-black is-small' href='" + d.fdl_label +"'>Reprint " + d.third_party_code +"</a> </td>";

    html += "</tr>"
    html += "</table>"

    // `d` is the original data object for the row
    return html
}

$(document).ready(function () {

    var table;

    $(document).ready(function () {
        table = $('#example').DataTable({
            'columns': [
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
        return SendData(message.data)

    }

});

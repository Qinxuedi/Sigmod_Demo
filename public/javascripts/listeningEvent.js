/**
 * Created by luoyuyu on 2017/12/17.
 */

$("#dataBtn").click(function () {
    alert(numberOfDataset)
    $('#dataModal').modal({backdrop: 'static', keyboard: false}, 'show');
    //alert("In order to reduce the server pressure, we limits the user upload files in this version.")
});
$("#uploadBtn").click(function () {
    $('#uploadModal').modal({backdrop: 'static', keyboard: false}, 'show');
    //alert("In order to reduce the server pressure, we limits the user upload files in this version.")
});

$(".filterColumns").click(function () {
    alert($(this).parent().text());
    filterBuilder($(this).parent().text(),'filterBuilder');
});

function filterBuilder(getColumnNameID, addFilterBuilderID) {
    //get Column Type
        //1. if numerical
        //2. if category
        //3. if date
    //get Column Value

    //filter build


    //Static builder
    "use strict";
    let html = '';
    $("#"+addFilterBuilderID).append()
}
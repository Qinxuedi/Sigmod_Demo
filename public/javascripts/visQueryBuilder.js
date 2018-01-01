/**
 * Created by luoyuyu on 2017/12/17.
 */
/////////Visualization Query Builder////////////////
$("#visQueryBuilder").click(function () {
    $('#visQueryModal').modal({backdrop: 'static', keyboard: false}, 'show');
    visQueryBuilder();
});

//初始化deepeye visualization query 的函数
function visQueryBuilder() {
    "use strict";
    //TODO init vis query select option
    //1. for select X
    //2. for select Y
    let visHtml = `<option>Bar</option><option>Line</option><option>Pie</option><option>Scatter</option>`;
    let xHtml = ``;
    let yHtml = ``;
    let fromHtml = `<option>${tableName}</option>`;
    let groupBinHtml = `<option>-- --</option>`;
    let orderHtml = `<option>-- --</option>`;
    for (let i = 0; i < varColName.length; i++){
        xHtml += `<option>${varColName[i]}</option>`;
        yHtml += `<option>${varColName[i]}</option>`;
        yHtml += `<option>COUNT(${varColName[i]})</option>`;
        yHtml += `<option>SUM(${varColName[i]})</option>`;
        yHtml += `<option>AVG(${varColName[i]})</option>`;
        groupBinHtml += `<option>Group by ${varColName[i]}</option>`;
        groupBinHtml += `<option>Bin by ${varColName[i]}</option>`;
        orderHtml += `<option>Order by ${varColName[i]}</option>`;
    }
    $(".visualize").empty();
    $(".visualize").append(visHtml);
    $(".selectX").empty();
    $(".selectX").append(xHtml);
    $(".selectY").empty();
    $(".selectY").append(yHtml);
    $(".from").empty();
    $(".from").append(fromHtml);
    $(".group_bin").empty();
    $(".group_bin").append(groupBinHtml);
    $(".order").empty();
    $(".order").append(orderHtml);
}

//TODO update option according to user's selection
// function updateQueryBuilder() {
//
// }


$("#addVisQuery").click(function () {
    let html = `<tr id = ${$("#queryTableBody tr").length}>`;
    let visHtml = `<td><select class="visualize form-control"><option>Bar</option><option>Line</option><option>Pie</option><option>Scatter</option></select></td>`;
    let xHtml = `<td><select class="selectX form-control">`;
    let yHtml = `<td><select class="selectY form-control">`;
    let fromHtml = `<td><select class="from form-control"><option>${tableName}</option></select></td>`;
    let groupBinHtml = `<td><select class="group_bin form-control"><option>-- --</option>`;
    let orderHtml = `<td><select class="order form-control"><option>-- --</option>`;
    for (let i = 0; i < varColName.length; i++){
        xHtml += `<option>${varColName[i]}</option>`;
        yHtml += `<option>${varColName[i]}</option>`;
        yHtml += `<option>COUNT(${varColName[i]})</option>`;
        yHtml += `<option>SUM(${varColName[i]})</option>`;
        yHtml += `<option>AVG(${varColName[i]})</option>`;
        groupBinHtml += `<option>Group by ${varColName[i]}</option>`;
        groupBinHtml += `<option>Bin by ${varColName[i]}</option>`;
        orderHtml += `<option>Order by ${varColName[i]}</option>`;
    }
    xHtml += `</select></td>`;
    yHtml += `</select></td>`;
    groupBinHtml += `</select></td>`;
    orderHtml += `</select></td>`;
    html += visHtml;
    html += xHtml;
    html += yHtml;
    html += fromHtml;
    html += groupBinHtml;
    html += orderHtml;
    html += `</tr>`;
    $("#queryTableBody").append(html);
});

$("#subVisQuery").click(function () {
    $("tr[id = '"+($("#queryTableBody tr").length - 1)+"']").remove();
});

$("#visQueryStartBtn").click(function () {
    alert("send vis query")
});
/**
 * Created by luoyuyu on 2017/12/17.
 */
//https://segmentfault.com/q/1010000000486619
//事件委托机制。 监听用户选择去过滤的列名. 点击filter button
$("#filterFooter").on('click','#filterBtn',function () {
    "use strict";
    alert("developing~~");
    //对于value的过滤条件进行处理
    if ($(this).attr("class").indexOf('filterNumerical') != -1){
        // alert("developing")
    }
    // 对于category（checkbox）的过滤条件进行处理
    if ($(this).attr("class").indexOf('filterCategory') != -1){
        // alert("developing")
    }
});

//事件委托机制。 监听用户选择去min,max
$("#filterBuilder").on('change mousemove', '#minSlider', function () {
    // if ($("#minSlider").val() > $("#maxSlider").val()){
    //     alert()
    // }else {
    //     $("#minValue").text($("#minSlider").val());
    // }
    $("#minValue").text($("#minSlider").val());
});

$("#filterBuilder").on('change mousemove', '#maxSlider', function () {
    // if ($("#maxSlider").val() < $("#minSlider").val()){
    //     let max = $("#minSlider").val() + 1;
    //     $("#maxValue").text(max);
    // }else{
    //     $("#maxValue").text($("#maxSlider").val());
    // }
    $("#maxValue").text($("#maxSlider").val());
});

function allCheck(checkboxClassName, boolean) {
    "use strict";
    let allValue = document.getElementsByClassName(checkboxClassName);
    for (let i = 0; i < allValue.length; i++) {
        if (allValue[i].type == "checkbox")
            allValue[i].checked = boolean;
    }
}

function searchResults(value) {
    "use strict";
    $("div.filterCheckbox").each(function () {
        if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) != -1){
            $(this).show();
        }else {
            $(this).hide();
        }
    })
}

function clickToSearch() {
    "use strict";
    if ($(".searchElement").length == 1){//First time， add search input
        let html = `<input type="search" class="form-control searchElement" onkeyup="searchResults(this.value)" placeholder="search elements" aria-describedby="search elements input">`;
        $("#searchInputDiv").append(html);
    }else {// second time, delete search input
        $("#searchInputDiv").html('');
    }
}

//https://segmentfault.com/q/1010000000486619
//事件委托机制。 监听用户选择去过滤的列名
$("#columns").on('click','.filterColumns',function(){
    console.log($(this).parent().text());
    filterBuilder($(this).parent().text(),'filterBuilder');
});


function filterBuilder(getColumnNameID, addFilterBuilderID) {
    "use strict";
    //get Column Type
    $.ajax({
        method: 'GET',    // 如果要使用GET方式，则将此处改为'get'
        url: "/data/getColumnValues",
        data: {
            tableID: tableName,
            columnName: getColumnNameID
        },
        dataType: 'json',
        success: function (data) {
            let selector = 'filter-'+getColumnNameID;
            if (data.type == "numerical"){
                if ($("div[id='"+selector+"']").length > 0){//if the first one, create it.
                    $("div[id='"+selector+"']").remove();
                }else { // if more than first ont, delete it.
                    // $("#"+addFilterBuilderID).empty(); 不清空上次的过滤条件，因为可以多次过滤
                    let html = `<div class="panel panel-default" id ='filter-${getColumnNameID}'>
                  <div class="panel-heading">
                    <h5 class="panel-title">${getColumnNameID}</h5>
                  </div>
                  <div class="panel-body" style="max-height:10em;overflow-y: scroll;">
                    <form class="form-inline">
                        <label for="minValue">Mix:</label>
                        <span id="minValue">${data.value[0].toFixed(2)}</span>
                        <input type="range" id="minSlider" min=${data.value[0].toFixed(2)} max=${data.value[1].toFixed(2)} value=${data.value[0].toFixed(2)}>
                    </form>
                    <form class="form-inline">
                        <label for="maxValue">Max:</label>
                        <span id="maxValue">${data.value[1].toFixed(2)}</span>
                        <input type="range" id="maxSlider" min=${data.value[0].toFixed(2)} max=${data.value[1].toFixed(2)} value=${data.value[1].toFixed(2)}>
                    </form>
                  </div>
                  </div></div>`;

                    $("#"+addFilterBuilderID).append(html);

                    if($("#filterBtn").length == 0){
                        let filterButtonHtml ='<button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block filterCategory">' +
                            '<span class="glyphicon glyphicon glyphicon-play-circle"></span>Filter Now</button>';
                        $("#filterFooter").append(filterButtonHtml);
                    }
                }
            }
            if (data.type == "category" || data.type == "date"){
                //清空原来的
                // $("#"+addFilterBuilderID).empty(); 不清空上次的过滤条件，因为可以多次过滤
                if ($("div[id='"+selector+"']").length > 0){//if the first one, create it.
                    $("div[id='"+selector+"']").remove();
                }else{
                    let html = `<div class="panel panel-default" id ='filter-${getColumnNameID}'>
                  <div class="panel-heading">
                    <h5 class="panel-title filterColumnId">${getColumnNameID}</h5>
                  </div>
                  <div class="panel-body" style="max-height:10em;overflow-y: scroll;">
                    <a href="javascript:allCheck('filterCheckbox',true)">check all</a> 
                    /
                    <a href="javascript:allCheck('filterCheckbox',false)">uncheck all</a> 
                    /
                    <a href="javascript:clickToSearch()" class="searchElement">
                        <span aria-hidden="true" class="glyphicon glyphicon-search"></span>
                    </a>
                    <div class="input-group input-group-sm" id="searchInputDiv"></div>`;
                    for (let i = 0; i < data.value.length; i++){
                        html += `<div class="checkbox filterCheckbox">
                            <label>
                              <input type="checkbox" class="filterCheckbox">${data.value[i]}
                            </label>
                        </div>`
                    }
                    html += '</div></div>';
                    $("#"+addFilterBuilderID).append(html);

                    if($("#filterBtn").length == 0){
                        let filterButtonHtml ='<button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block filterCategory">' +
                            '<span class="glyphicon glyphicon glyphicon-play-circle"></span>  Filter Now' +
                            '</button>';
                        $("#filterFooter").append(filterButtonHtml);
                    }
                }
            }
            //TODO 日期类
            // if (data.type == "date"){
            //
            // }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        // "use strict";
        alert("something wrong.")
        }
    });
}
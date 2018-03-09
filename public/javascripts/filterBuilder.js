/**
 * Created by luoyuyu on 2017/12/17.
 */
var selectedDataAfterFilter = {}; // should clean this array 1. select new dataset; 2. have click "Filter Now" button

//https://segmentfault.com/q/1010000000486619
//事件委托机制。 监听用户选择去过滤的列名. 点击filter button
$("#filterFooter").on('click','#filterBtn',function () {
    "use strict";
    //TODO processing coding strart here
    $.ajax({
        method: 'GET',
        url: "/vizByFilter",
        data: {
            selectedDataAfterFilter: selectedDataAfterFilter,
            tableName: tableName
        },
        dataType: 'json',
        success: function(response) {
            //TODO; If filter successfully, then clean this array.
            // selectedDataAfterFilter = {};
            //处理返回的数据
            let data = response.data.split('\n');
            data.pop();
            // console.log("PartialOrder接受后台的data类型:",typeof (data));
            if (data[0] === "{}") {
                //TODO 更新chartAreaTitle
                document.getElementById("chartAreaTitle").innerHTML = '<h4>DeepEye Recommendation: ' + `<span>${data.length - 1} visualizations</span></h4>`;
            }
            else {
                //TODO sum or avg, filter some related charts
                //code here ...
                data_for_show_more = [];
                for (let i = 0; i < data.length; i++){
                    data_for_show_more[i]  = JSON.parse(data[i]);
                }
                console.log("data_for_show_more ==>",data_for_show_more);
                data_response_to_draw = [];
                data_response_to_draw.push(JSON.parse(data[0]));
                for (let i = 1; i < data.length - 1; i++){
                    let jsonData1 = JSON.parse(data[i]);
                    let jsonData2 = JSON.parse(data[i+1]);
                    if (jsonData1.order1 != jsonData2.order1){
                        data_response_to_draw.push(jsonData2);
                    }
                }
                console.log("data->",data_response_to_draw);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //TODO Keyword-to-visualization
                //code start here
                if (!isEmpty(selectedKeywords)){
                    data_response_to_draw = data_for_show_more;
                    console.log("Start: Keyword-to-visualization~");
                    let temData = data_response_to_draw;
                    data_response_to_draw = [];
                    // search VisType
                    for (let i = 0; i < temData.length; i++){
                        for (let j = 0; j < selectedKeywords.visType.length; j++){
                            if (selectedKeywords.visType[j] == temData[i].chart){
                                data_response_to_draw.push(temData[i]);
                            }
                        }
                    }
                    console.log("visType->data_response_to_draw",data_response_to_draw);
                    // search Selected Attributes
                    temData = data_response_to_draw;
                    data_response_to_draw = [];
                    for (let i = 0; i < temData.length; i++){
                        for (let j = 0; j < selectedKeywords.selectedAttr.length; j++){
                            let xName = temData[i].x_name.toLowerCase();
                            let yName = temData[i].y_name.toLowerCase();
                            if ((xName.indexOf(selectedKeywords.selectedAttr[j]) != -1) || (yName.indexOf(selectedKeywords.selectedAttr[j]) != -1)){
                                temData[i]['order'] = temData[i].order1+'-'+temData[i].order2;
                                let ifExisting = false;
                                for (let k = 0; k < data_response_to_draw.length; k++){
                                    if ( data_response_to_draw[k].order == temData[i].order ) ifExisting = true;
                                }
                                if (!ifExisting){
                                    data_response_to_draw.push(temData[i]);
                                }
                            }
                        }
                    }
                    console.log("selectedAttr->data_response_to_draw",data_response_to_draw);
                    // search Selected selectedAgg
                    temData = data_response_to_draw;
                    data_response_to_draw = [];
                    for (let i = 0; i < temData.length; i++){
                        for (let j = 0; j < selectedKeywords.selectedAgg.length; j++){
                            if (selectedKeywords.selectedAgg[j] == 'count') selectedKeywords.selectedAgg[j] = 'cnt';
                            let agg = temData[i].y_name.toLowerCase();
                            if (agg.indexOf(selectedKeywords.selectedAgg[j]) != -1){
                                data_response_to_draw.push(temData[i]);
                            }
                        }
                    }
                    //TODO code for show more
                    temData = data_response_to_draw;
                    data_response_to_draw = [];
                    data_response_to_draw.push(temData[0]);
                    for (let i = 1; i < temData.length - 1; i++){
                        let ifExisting = false;
                        for (let k = 0; k < data_response_to_draw.length; k++){
                            if ( data_response_to_draw[k].order1 == temData[i].order1 ) ifExisting = true;
                        }
                        if (!ifExisting){
                            data_response_to_draw.push(temData[i]);
                        }
                    }
                    selectedKeywords = []; // Clear
                }
                //code end here
                data =  data_response_to_draw;
                console.log("data_response_to_draw ==> ",data_response_to_draw);
                if ((data.length == 1 && data[0] === undefined) || data.length == 0){
                    //TODO 更新chartAreaTitle
                    document.getElementById("chartAreaTitle").innerHTML  = '<h4>DeepEye Recommendation:  ' + `<span> 0 visualizations</span></h4>`;
                }else {
                    let pageNum = Math.ceil(data.length / pageSize);
                    //TODO 更新chartAreaTitle
                    document.getElementById("chartAreaTitle").innerHTML  = '<h4>DeepEye Recommendation: ' + ` <span>${data.length} visualizations</span></h4>`;
                    $('#chartsContainerPage').html(
                        `<nav aria-label="...">
                              <ul class="pagination">
                              </ul>
                              </nav>`);
                    $("#chartsContainerPage").css("text-align", "center");
                    let pageNumHtml = '';
                    for(let i = 1; i <= pageNum; i++) {
                        pageNumHtml += `<li class="${i === 1 ? "active" : ""}"><a href="#"><span>${i}</span><span class="sr-only">(current)</span></a></li>`;
                    }
                    $('#chartsContainerPage').find('.pagination').html(pageNumHtml);
                    let html = '';
                    ////TODO step 1: 删除之前已经存在的div
                    deleteExistDiv();
                    data.slice(0, pageSize).forEach((value,index) => {
                        // 画6个图
                        createChart(value, index, false);
                    });
                    // 绑定事件 绑定在父元素上面
                    $('#chartsContainerPage').find('.pagination li').click(function () {
                        ////TODO step 1: 删除之前已经存在的div
                        deleteExistDiv();
                        let clickPage = parseInt($(this).find('a span').html());
                        $(this).addClass("active");
                        $(this).siblings().removeClass("active");
                        data.slice((clickPage - 1) * pageSize, clickPage * pageSize).forEach((value, index) => {
                            // TODO 画6个图
                            createChart(value, (clickPage-1)*pageSize+index, false);
                        });
                    });
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("something wrong.");
        }
    });
});

//事件委托机制。 监听用户选择去min,max
$("#filterBuilder").on('click', '#minSlider', function () {
    // console.log("max slide  ","min = ",$("#minSlider").val(), "max = ",$("#maxSlider").val())
    let max = $("#maxSlider").val();
    let min = $("#minSlider").val();
    if (min > max){
        document.getElementById("minSlider").value = $("#maxSlider").val() - 1;
        $("#minValue").text($("#maxSlider").val() - 1);
        // set slider bar value
        console.log("can not")
    }else {
        console.log("can")
        $("#minValue").text($("#minSlider").val());
        //TODO put value in the obj
        if($.isEmptyObject(selectedDataAfterFilter[$("#maxValue").parent().parent().parent().attr("id").substr(7,)])){// 空对象
            let tmpObj = {'min': $("#minSlider").val()};
            selectedDataAfterFilter[$("#minValue").parent().parent().parent().attr("id").substr(7,)] = tmpObj;
        }else {
            selectedDataAfterFilter[$("#minValue").parent().parent().parent().attr("id").substr(7,)]['min'] = $("#minSlider").val();
        }
    }
});

$("#filterBuilder").on('click', '#maxSlider', function () {
    // console.log("max slide  ","min = ",$("#minSlider").val(), "max = ",$("#maxSlider").val(), '$("#maxSlider").val() < $("#minSlider").val()', $("#maxSlider").val() < $("#minSlider").val() )
    let max = $("#maxSlider").val();
    let min = $("#minSlider").val();
    if (max < min){
        document.getElementById("maxSlider").value = $("#minSlider").val() + 1;
        $("#maxValue").text($("#minSlider").val() + 1);
        // set slider bar value
        console.log("can not")
    }else{
        console.log("can")
        $("#maxValue").text($("#maxSlider").val());
        //TODO put value in the obj
        if($.isEmptyObject(selectedDataAfterFilter[$("#maxValue").parent().parent().parent().attr("id").substr(7,)])){// 空对象
            let tmpObj = {'max': $("#maxSlider").val()};
            selectedDataAfterFilter[$("#maxValue").parent().parent().parent().attr("id").substr(7,)] = tmpObj;
        }else {
            selectedDataAfterFilter[$("#maxValue").parent().parent().parent().attr("id").substr(7,)]['max'] = $("#maxSlider").val();
        }
    }
});


//事件委托机制。 监听用户选中和取消选中 checkbox的时间
$("#filterBuilder").on('click', '.filter-selection', function () {
    // 实时更新选中/取消选中的状态.
    //TODO put value in the obj
    console.log($(this));
    if ($(this).is(':checked')){//选中的话
        console.log($(this).attr("id").substr(6,));
        console.log($(this).attr("value"))
        if($.isEmptyObject(selectedDataAfterFilter[$(this).attr("id").substr(6,)])){// 空对象
            let tmpObj = [];
            tmpObj.push($(this).attr("value"));
            selectedDataAfterFilter[$(this).attr("id").substr(6,)] = tmpObj;
        }else {
            selectedDataAfterFilter[$(this).attr("id").substr(6,)].push($(this).attr("value"));
        }
    }else {//取消选中
        console.log("don't checked")
        let index = selectedDataAfterFilter[$(this).attr("id").substr(6,)].indexOf($(this).attr("value"));
        console.log("index = ", index);
        if (index != -1){
            if (index == 0) selectedDataAfterFilter[$(this).attr("id").substr(6,)].splice(index,index+1);
            else selectedDataAfterFilter[$(this).attr("id").substr(6,)].splice(index,index);
        }
    }

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
                        <label for="minValue">Min:</label>
                        <span id="minValue" class="filter-selection colID-${getColumnNameID}">${data.value[0].toFixed(2)}</span>
                        <input type="range" id="minSlider" min=${data.value[0].toFixed(2)} max=${data.value[1].toFixed(2)} value=${data.value[0].toFixed(2)}>
                    </form>
                    <form class="form-inline">
                        <label for="maxValue">Max:</label>
                        <span id="maxValue" class="filter-selection colID-${getColumnNameID}">${data.value[1].toFixed(2)}</span>
                        <input type="range" id="maxSlider" min=${data.value[0].toFixed(2)} max=${data.value[1].toFixed(2)} value=${data.value[1].toFixed(2)}>
                    </form>
                  </div>
                  </div></div>`;

                    $("#"+addFilterBuilderID).append(html);

                    if($("#filterBtn").length == 0){ // check if the first button
                        let filterButtonHtml ='<button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block filterNumerical">' +
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
                              <input type="checkbox" id = "colID-${getColumnNameID}" value="${data.value[i]}" class="filterCheckbox filter-selection">${data.value[i]}
                            </label>
                        </div>`
                    }
                    html += '</div></div>';
                    $("#"+addFilterBuilderID).append(html);

                    if($("#filterBtn").length == 0){ // check if the first button
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
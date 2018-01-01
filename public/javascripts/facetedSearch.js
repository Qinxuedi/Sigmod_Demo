/**
 * Created by luoyuyu on 2017/12/6.
 */
var data_facetedSearch = [];

$(".facetedSearchContainer").click(function (event) {
    event = event || window.event; //For IE
    console.log(event);
    if(event.target.className.match(/btnSearch/)){//FOR Faceted Search
        let tag = event.target.dataset.echartsbtn; //main0
        //0. 如果之前由元素highlight，清除掉
        $(".panel .panel-primary").removeClass("panel-primary");
        //1. 给选中进行faceted search的元素添加一个highlight
        $("#"+tag).parent().parent().addClass("panel-primary");

        let index = 0;
        console.log("index = ",index);
        // console.log(data_response_to_draw[index]);
        let describe = '';
        let x_name = '';
        let y_name = '';
        let chart = '';

        // maintain the selected vis here
        let myChart = echarts.init(document.getElementById(event.target.dataset.echartsbtn)); //init echarts
        let picInfo = myChart.getDataURL(); //get based64
        if (picInfo){
            //change number of select charts
            let NumOfSelChart = Number($("#selectedNumber").text()) + 1;
            $("#selectedNumber").text(NumOfSelChart);
            let html = `<div class="col-sm-12 col-md-6 removeSelectedVis">
                              <div class="thumbnail">
                                  <img src='${picInfo}' alt="Selected Pic"/>
                              </div>
                            </div>`;
            $("#selectedChartsContainer").append(html);
        }


        //faceted search from faceted search panel
        if (event.currentTarget.id == "facetedSearchContainer"){
            //do faceted search, get necessary info.
             index = event.target.dataset.echartsbtn.substr(7,tag.length);
             describe = data_facetedSearch[index].describe;
             x_name = data_facetedSearch[index].x_name;
             y_name = data_facetedSearch[index].y_name;
             chart = data_facetedSearch[index].chart;

        }
        //faceted search from recommendation panel
        if (event.currentTarget.id == "chartsContainer"){
            index = event.target.dataset.echartsbtn.substr(4,tag.length);
            console.log("event.target.dataset.echartsbtn = ",event.target.dataset.echartsbtn);
            console.log("index = ",index);
             describe = data_response_to_draw[index].describe;
             x_name = data_response_to_draw[index].x_name;
             y_name = data_response_to_draw[index].y_name;
             chart = data_response_to_draw[index].chart;
        }

        //通过ajax调用后台算法，并将生成的图贴在新的faceted search页面
        $.ajax({
            url: '/facetedSearch',
            type: 'GET',
            data: {
                tableName: tableName,
                describe: describe,
                x_name: x_name,
                y_name: y_name,
                chart: chart
            },
            dataType: 'json',
            success: function(data){
                //delete last times div
                deleteExistFacetedDiv();


                try{
                    data = data[0].split('\n');
                }catch (err){
                    let cnt = {
                        'changeType': 0,
                        'changeX':0,
                        'changeY':0,
                        'changeGB': 0
                    };
                    createFacetedDiv(cnt);
                }

                // console.log("data0 = ",data);

                data_facetedSearch = [];

                for (let i = 0; i < data.length; i++){
                    if (data[i] != "" ){
                        let inputData = JSON.parse(data[i]);
                        if (inputData.x_name != inputData.y_name){
                            inputData['index'] = data_facetedSearch.length;
                            data_facetedSearch.push(inputData);
                        }
                    }
                }
                console.log("data1 = ",data_facetedSearch);

                // for different type
                for (let i = 0; i < data_for_show_more.length; i++){
                    if (describe == data_for_show_more[i].describe && x_name == data_for_show_more[i].x_name && y_name == data_for_show_more[i].y_name && chart != data_for_show_more[i].chart){
                        let inputData = data_for_show_more[i];
                        inputData['index'] = data_facetedSearch.length;
                        inputData['changeTag'] = 'changeType';
                        data_facetedSearch.push(inputData);
                    }
                }

                console.log("data2 = ",data_facetedSearch);
                let cnt = {
                    'changeType': 0,
                    'changeX':0,
                    'changeY':0,
                    'changeGB': 0
                };
                for (let i = 0; i < data_facetedSearch.length; i++){
                    if (data_facetedSearch[i].changeTag == 'changeX'){
                        cnt.changeX ++;
                    }
                    if (data_facetedSearch[i].changeTag == 'changeY'){
                        cnt.changeY ++;
                    }
                    if (data_facetedSearch[i].changeTag == 'changeType'){
                        cnt.changeType ++;
                    }
                    if (data_facetedSearch[i].changeTag == 'changeBin'){
                        cnt.changeGB ++;
                    }
                }
                //TODO Create Div and then draw
                createFacetedDiv(cnt);

                //for different aggfunc
                // for (let i = 0; i < data_for_show_more.length; i++){
                //     if (describe == data_for_show_more[i].describe && x_name == data_for_show_more[i].x_name && y_name != data_for_show_more[i].y_name && chart == data_for_show_more[i].chart){
                //         let ty_name1 = y_name.substr(4, y_name.length - 1);
                //         let ty_name2 = data_for_show_more[i].y_name.substr(4, data_for_show_more[i].y_name.length - 1);
                //         let fun1 = y_name.substr(0, 3);
                //         let fun2 = data_for_show_more[i].y_name.substr(0,3);
                //         if (ty_name1 == ty_name2 && fun1 != fun2){
                //             let inputData = data_for_show_more[i];
                //             inputData['index'] = data_facetedSearch.length;
                //             inputData['changeTag'] = 'changeAgg';
                //             data_facetedSearch.push(inputData);
                //         }
                //     }
                // }

                document.getElementById("facetedHeader").innerHTML  =  ` <h4>Faceted Search: ${data_facetedSearch.length} visualizations</h4>`;
                // console.log("data_facetedSearch = ",data_facetedSearch);


                for (let i = 0; i < data_facetedSearch.length; i++){
                    createChartsInFacetedDiv(data_facetedSearch[i], i);
                }

            },
            error: function(jqXHR, textStatus, errorThrown){
                alert("something wrong!")
            }
        });
    }
});

//create div container faceted panel.
function createFacetedDiv(cnt) {
    "use strict";
    let headingHtml = `<ul id="myTab" class="nav nav-tabs removeFacetedDiv">
                          <li class="active"><a href="#visType" data-toggle="tab">By Visualization Type (${cnt.changeType})</a></li>
                          <li><a href="#xAxis" data-toggle="tab">By xAxis (${cnt.changeX})</a></li>
                          <li><a href="#yAxis" data-toggle="tab">By yAxis (${cnt.changeY})</a></li>
                          <li><a href="#ifBin" data-toggle="tab">By Group/Bin (${cnt.changeGB})</a></li>
                        </ul>`;
    $("#facetedPanelHeading").append(headingHtml);

    let chartHtml = `<div class="removeFacetedDiv">
                        <div id="myTabContent" class="tab-content">
                          <div id="visType" class="tab-pane fade in active">
                            <h4>By Visualization Type</h4>
                            <hr/>
                            <div id="visType-content"></div>
                          </div>
                          <div id="xAxis" class="tab-pane fade">
                            <h4>By x-axis</h4>
                            <hr/>
                            <div id="xAxis-content"></div>
                          </div>
                          <div id="yAxis" class="tab-pane fade">
                            <h4>By y-axis</h4>
                            <hr/>
                            <div id="yAxis-content"></div>
                          </div>
                          <div id="ifBin" class="tab-pane fade">
                            <h4>If Group/Bin by x-axis or y-axis</h4>
                            <hr/>
                            <div id="ifBin-content"></div>
                          </div>
                        </div>
                      </div>`;

    $("#facetedSearchContainer").append(chartHtml);
}

//for visualization in faceted panel.
function createChartsInFacetedDiv(value, index) {
    "use strict";
    let gridForSingle = [{left: '20%', width: '65%',top:'25%', height: "55%"}];
    let gridForStacked = [{left: '20%', width: '65%',top:'30%', height: "50%"}];
    // console.log("value = ",value);
    // 画图操作
    let chartId = 'faceted'+index;
    let drawData = value;
    //TODO 创建div
    console.log("changeTage = ", drawData.changeTag);
    createFacetedChartDiv(drawData.changeTag, chartId);
    //TODO 开始画图操作
    if (drawData.classify.length === 0){//TODO 2列的情况
        if (drawData.chart === "bar")
            createBar(drawData, chartId, gridForSingle);
        else  if (drawData.chart === "line")
            createLine(drawData, chartId, gridForSingle);
        else  if (drawData.chart === "pie")
            createPie(drawData, chartId, gridForSingle);
        else if (drawData.chart === "scatter")
            createScatter(drawData, chartId, gridForSingle);
    }
    else {//TODO 3列的情况
        if (drawData.chart === "bar")
            createStackedBar(drawData, chartId, gridForStacked);
        else  if (drawData.chart === "line")
            createStackedLine(drawData, chartId, gridForStacked);
        else if (drawData.chart === "scatter")
            createStackedScatter(drawData, chartId, gridForStacked);
    }
}

function createFacetedChartDiv (changeTag, Echart) {

    let chartW = ($('#myTabContent').width())*0.90 ;
    let chartH = ($('#myTabContent').width())*0.75 ;
    let chartHtml= `<div id=${Echart}  style="width: `+chartW+`px;height:`+chartH+`px;"></div>`;
    chartHtml += `<button class="btn btn-warning btnSearch" style="float:right" data-echartsbtn=${Echart}>Faceted Search</button> `;
    // chartHtml += `<button class="btn btn-info btnZoom" style="float:right" data-echartsbtn=${Echart}>Zoom</button> `;
    let html = document.createElement('div');
    html.innerHTML = chartHtml;
    // html.style.cssText = "padding: 1%;border:1px solid #ddd;float:left;display:inline-block";
    html.className = "removeFacetedDiv";
    if (changeTag == "changeType"){
        document.getElementById("visType-content").appendChild(html);
    }
    // if (changeTag == "changeAgg"){
    //     document.getElementById("ifAgg-content").appendChild(html);
    // }
    if (changeTag == "changeX"){
        document.getElementById("xAxis-content").appendChild(html);
    }
    if (changeTag == "changeY"){
        document.getElementById("yAxis-content").appendChild(html);
    }
    if (changeTag == "changeBin"){
        document.getElementById("ifBin-content").appendChild(html);
    }
    if (changeTag == "changeChart"){
        document.getElementById("visType-content").appendChild(html);
    }
}

var deleteExistFacetedDiv = function () {
    if($(".removeFacetedDiv").length>0){
        $(".removeFacetedDiv").remove();
    }
};


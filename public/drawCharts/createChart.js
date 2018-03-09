/**
 * Created by luoyuyu on 2017/9/24.
 */
var deleteExistDiv = function () {
    if($(".removeDiv").length>0){
        $(".removeDiv").remove();
    }
    if($(".removeFacetedDiv").length>0){
        $(".removeFacetedDiv").remove();
    }
    if($(".removeSelectedVis").length>0){
        $(".removeSelectedVis").remove();
    }
    $("#selectedNumber").text(0);

    $("#facetedHeader").text('Faceted Search: 0 Visualizations')
};


var createNewDiv = function (Echart,show_option) { // i 表示现在是第几个 div //推荐时用的
    let chartW = ($('#chartsContainer').width())*0.90;
    let chartH = ($('#chartsContainer').width())*0.75;
    //style="display: none"
    let chartHtml = `<div class="panel panel-default">
        <div class="panel-body">
        <div id=${Echart}  style="width: ${chartW}px;height: ${chartH}px;"></div>`;
    if (show_option.length !== 0){
        chartHtml +=`<label for="aggFun" style="float: left" class="control-label">Related charts:</label>
                    <select class=${show_option[0].order1}  style="float: left">`;
        for (let i = 0; i < show_option.length; i++){
            chartHtml += `<option id = ${show_option[i].order1+','+show_option[i].order2}>`;
            chartHtml += show_option[i].chart+", "+show_option[i].y_name;
            chartHtml += `</option>`;
        }
        chartHtml += `</select>
            <button class="btn btn-info btnShowMore btn-sm" style="float:left" data-showmore=${show_option[0].order1}>Show</button>`
    }
    chartHtml += `<button class="btn btn-warning btnSearch btn-sm" style="float:right" data-echartsbtn=${Echart}>Faceted Search</button>
                    </div></div>`;
    // chartHtml += `<button class="btn btn-info btnZoom" style="float:right" data-echartsbtn=${Echart}>Zoom</button> `;
    let html = document.createElement('div');
    html.innerHTML = chartHtml;
    // html.style.cssText = "padding: 1%;border:1px solid #ddd;float:left;display:inline-block";
    html.className = "removeDiv";
    //For Faceted Search
    //html.innerHTML +=  `<button class="btn btn-warning btnSearch" style="float:right" data-echartsbtn=${Echart}>Faceted Search</button> `;
    document.getElementById("chartsContainer").appendChild(html);
};

var createNewDivInZoom = function (Echart,PadVid) { // i 表示现在是第几个 div //推荐时用的
    let chartHtml= `<div id=${Echart}  style="width: `+720+`px;height:`+480+`px;"></div>`;
    let html = document.createElement('div');
    html.innerHTML = chartHtml;
    html.className = "removeDiv";
    document.getElementById(PadVid).appendChild(html);
};

function listLikeGoogleSearch(drawData, chartID, myChart) {
    let nlp = '';
    let y_nlp = '';
    if (drawData.y_name.indexOf('SUM') != -1){
        y_nlp += ' the summation of ' + drawData.y_name.substr(4,drawData.y_name.length-1-4);
    }
    if (drawData.y_name.indexOf('CNT') != -1){
        y_nlp += ' the amount of '  + drawData.y_name.substr(4,drawData.y_name.length-1-4);
    }
    if (drawData.y_name.indexOf('AVG') != -1){
        y_nlp += ' the average of '  + drawData.y_name.substr(4,drawData.y_name.length-1-4);
    }

    if (drawData.chart == 'bar'){
        // console.log("drawData.x_data = ",drawData.x_data[0]);
        nlp += 'This bar chart shows that' + y_nlp +  ' of ' + drawData.x_data[0][0] + ', ... , ' + drawData.x_data[0][drawData.x_data[0].length-1];
    }

    if (drawData.chart == 'pie'){
        nlp += 'This pie chart shows that the proportion of ' + drawData.x_name;
    }

    if (drawData.chart == 'line'){
        nlp += 'This line chart reflects ' + y_nlp + ' change over the ' + drawData.x_name;
    }

    if (drawData.chart == 'scatter'){
        nlp += 'This scatter chart shows the correlation between ' + drawData.y_name + ' and ' + drawData.x_name;
    }

    let picInfo = myChart.getDataURL();
    if (picInfo){
        let picHtml = `<div class="row removeDiv">
                          <div class="col-sm-4 col-md-5 smallPic">
                            <div class="thumbnail"><img class="smallPic" src='${picInfo}' alt="DeepEye Recommendation Visualization"/></div>
                          </div>
                          <div class="col-sm-8 col-md-7">
                            <a>
                                <h4>A ${drawData.chart} with ${drawData.x_name} and ${drawData.y_name}</h4>
                            </a>
                            <p>${nlp}</p>
                            <button class="btn btn-default btn-sm btnZoom" data-echartsbtn=${chartID} aria-label="Left Align">
                                <span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span> Zoom
                            </button>
                            <button class="btn btn-default btn-sm btnSearch" data-echartsbtn=${chartID} aria-label="Left Align">
                              <span class="glyphicon glyphicon-search" aria-hidden="true"></span> Faceted
                            </button>
                            <button class="btn btn-default btn-sm btnSearch" data-echartsbtn=${chartID} aria-label="Left Align">
                              <span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Show Query
                            </button>
                            </div>
                        </div>`;
        $("#chartsContainer").append(picHtml);
    }
}

var createBar = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.bar.legend.data = [];
    console.log("createBar->drawData:",drawData);
    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;
    let myChart = echarts.init(document.getElementById(chartID));
    myOption.bar.xAxis.data = drawData.x_data[0];
    myOption.bar.series[0].data = drawData.y_data[0];
    myOption.bar.legend.data.push(drawData.y_name);
    myOption.bar.title.text = tableName;
    myOption.bar.title.subtext = Operation;
    myOption.bar.series[0].name = drawData.y_name;
    if (grid.length !== 0) {
        myOption.bar.grid = grid;
    }
    //TODO SAVE PIC

    // myOption.bar.animation = false;

    myChart.setOption(myOption.bar);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }

    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
    //TODO END OF SAVE PIC
    // myChart.setOption(myOption.stackedBar);
};
var createStackedBar = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.stackedBar.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;
    let data = [];
    for (let i = 0; i < drawData.classify.length; i++){
        data.push(
            {
            name:drawData.classify[i],
            stack: drawData.y_name,
            type:'bar',
            data:drawData.y_data[i]
            }
        )
    }
    let myChart = echarts.init(document.getElementById(chartID));
    myOption.stackedBar.xAxis.data = drawData.x_data[0];
    myOption.stackedBar.yAxis[0].name = drawData.y_name;
    myOption.stackedBar.xAxis.name = drawData.x_name;
    myOption.stackedBar.legend.data = drawData.classify;
    myOption.stackedBar.title.text = tableName;
    myOption.stackedBar.title.subtext = Operation;
    myOption.stackedBar.series = data;
    if (grid.length !== 0) {
        myOption.stackedBar.grid = grid;
    }
    //TODO Save pic
    // myOption.stackedBar.animation = false;

    myChart.setOption(myOption.stackedBar);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }

    // let picInfo = myChart.getDataURL();
    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
};
var createLine = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.line.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;

    let myChart = echarts.init(document.getElementById(chartID));
    console.log("drawData.x_data[0] = ",drawData.x_data[0])
    myOption.line.xAxis.data = drawData.x_data[0];
    myOption.line.series[0].data = drawData.y_data[0];
    myOption.line.legend.data.push(drawData.y_name);
    myOption.line.title.text = tableName;
    myOption.line.title.subtext = Operation;
    myOption.line.series[0].name = drawData.y_name;
    if (grid.length !== 0) {
        myOption.line.grid = grid;
    }
    //TODO SAVE PIC
    // myOption.line.animation =false;
    myChart.setOption(myOption.line);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }
    // let picInfo = myChart.getDataURL();
    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
};

var createStackedLine = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.stackedLine.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;
    let data = [];
    for (let i = 0; i < drawData.classify.length; i++){
        data.push(
            {
                name:drawData.classify[i],
                type:'line',
                data:drawData.y_data[i]
            }
        )
    }
    let myChart = echarts.init(document.getElementById(chartID));
    myOption.stackedLine.xAxis.data = drawData.x_data[0];
    myOption.stackedLine.yAxis[0].name = drawData.y_name;
    myOption.stackedLine.xAxis.name = drawData.x_name;
    myOption.stackedLine.legend.data = drawData.classify;
    myOption.stackedLine.title.text = tableName;
    myOption.stackedLine.title.subtext = Operation;
    myOption.stackedLine.series = data;
    if (grid.length !== 0) {
        myOption.stackedLine.grid = grid;
    }
    //TODO SAVE PIC
    // myOption.stackedLine.animation = false;
    myChart.setOption(myOption.stackedLine);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }
    // let picInfo = myChart.getDataURL();
    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
};

var createPie = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.pie.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;

    let data = [];
    for (let i = 0; i < drawData.x_data[0].length; i++)
        data.push({
            name: drawData.x_data[0][i],
            value: drawData.y_data[0][i]
        })
    let myChart = echarts.init(document.getElementById(chartID));
    myOption.pie.series[0].data = data;
    myOption.pie.legend.data = drawData.x_data[0];
    myOption.pie.title.text = tableName;
    myOption.pie.title.subtext = Operation;
    myOption.pie.series[0].name = drawData.y_name;
    if (grid.length !== 0) {
        myOption.pie.grid = grid;
    }

    // myOption.pie.animation = false;

    myChart.setOption(myOption.pie);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }
    // let picInfo = myChart.getDataURL();
    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
};
var createScatter = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.scatter.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;
    //N+N
    if (!isNaN(drawData.x_data[0][0]) && !isNaN(drawData.x_data[0][1])  && (drawData.x_data[0][0] <= 1900 || drawData.x_data[0][0]>=2018))
    {
        // console.log("N+N!");
        let data = [];
        for (let i = 0; i < drawData.x_data[0].length; i++)
            data[i] = [drawData.x_data[0][i], drawData.y_data[0][i]];
        // console.log("scatter->data = ",data);
        let myChart = echarts.init(document.getElementById(chartID));
        myOption.scatter.legend.data.push(drawData.y_name);
        myOption.scatter.title.text = tableName;
        myOption.scatter.title.subtext = Operation;
        myOption.scatter.xAxis.name = drawData.x_name;
        myOption.scatter.yAxis[0].name = drawData.y_name;
        myOption.scatter.series[0].name = `${drawData.x_name}:${drawData.y_name}`;
        myOption.scatter.series[0].data = data;
        if (grid.length !== 0) {
            myOption.scatter.grid = grid;
        }
        //TODO SAVE PIC
        // myOption.scatter.animation = false;

        myChart.setOption(myOption.scatter);

        //TODO save picture and data
        if (googleLike){
            listLikeGoogleSearch(drawData, chartID, myChart);
        }
        // console.log("scatter!!!!")
        // let picInfo = myChart.getDataURL();
        // if (picInfo){
        //     // console.log(picInfo)
        //     // console.log("send!!!!")
        //     $.ajax({
        //         url: '/savePic',
        //         type: 'GET',
        //         data: {
        //             picInfo: picInfo,
        //             drawData: drawData,
        //             tableName: tableName
        //         },
        //         dataType: 'json',
        //         success: function(data){
        //             console.log("scatter: " + data);
        //         },
        //         error: function(jqXHR, textStatus, errorThrown){
        //             alert("something wrong!")
        //         }
        //     });
        // }
    }
    //C+N
    else{
        // console.log("C+N!");
        let myChart = echarts.init(document.getElementById(chartID));
        myOption.scatter.xAxis.data = drawData.x_data[0];
        myOption.scatter.yAxis[0].name = drawData.y_name;
        myOption.scatter.series[0].data = drawData.y_data[0];
        myOption.scatter.legend.data.push(drawData.y_name);
        myOption.scatter.title.text = tableName;
        myOption.scatter.title.subtext = Operation;
        myOption.scatter.series[0].name = drawData.y_name;
        if (grid.length !== 0) {
            myOption.scatter.grid = grid;
        }

        //TODO SAVE PIC
        // myOption.scatter.animation = false;

        myChart.setOption(myOption.scatter);

        //TODO save picture and data
        if (googleLike){
            listLikeGoogleSearch(drawData, chartID, myChart);
        }
        // let picInfo = myChart.getDataURL();
        // if (picInfo){
        //     $.ajax({
        //         url: '/savePic',
        //         type: 'GET',
        //         data: {
        //             picInfo: picInfo,
        //             drawData: drawData,
        //             tableName: tableName
        //         },
        //         dataType: 'json',
        //         success: function(data){
        //             console.log(data);
        //         },
        //         error: function(jqXHR, textStatus, errorThrown){
        //             alert("something wrong!")
        //         }
        //     });
        // }
    }
};

var createStackedScatter = function (drawData, chartID, grid, googleLike) {
    //TODO 清空上一次残留
    myOption.stackedScatter.legend.data = [];

    let Operation =  'Operation: ';
    if (drawData.describe === "") Operation += 'none';
    else Operation += drawData.describe;
    let data = [];
    for (let i = 0; i < drawData.classify.length; i++){
        let scatterData = [];
        for (let j = 0; j < drawData.x_data[i].length; j++){
            scatterData.push([drawData.x_data[i][j],drawData.y_data[i][j]]);
        }
        // console.log("scatterData = ",scatterData);
        data.push(
            {
                name:drawData.classify[i],
                stack: drawData.y_name,
                type:'scatter',
                data:scatterData
            }
        )
    }
    let myChart = echarts.init(document.getElementById(chartID));
    myOption.stackedScatter.xAxis.data = drawData.x_data[0];
    myOption.stackedScatter.yAxis[0].name = drawData.y_name;
    myOption.stackedScatter.xAxis.name = drawData.x_name;
    myOption.stackedScatter.legend.data = drawData.classify;
    myOption.stackedScatter.title.text = tableName;
    myOption.stackedScatter.title.subtext = Operation;
    myOption.stackedScatter.series = data;
    if (grid.length !== 0) {
        myOption.stackedScatter.grid = grid;
    }

    // myOption.stackedScatter.animation = false;

    myChart.setOption(myOption.stackedScatter);

    //TODO save picture and data
    if (googleLike){
        listLikeGoogleSearch(drawData, chartID, myChart);
    }
    // let picInfo = myChart.getDataURL();
    // if (picInfo){
    //     $.ajax({
    //         url: '/savePic',
    //         type: 'GET',
    //         data: {
    //             picInfo: picInfo,
    //             drawData: drawData,
    //             tableName: tableName,
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //             console.log(data);
    //         },
    //         error: function(jqXHR, textStatus, errorThrown){
    //             alert("something wrong!")
    //         }
    //     });
    // }
};

var createChart = function (value, index, googleLike) {
    let gridForSingle = [{left: '20%', width: '65%',top:'25%', height: "55%"}];
    let gridForStacked = [{left: '20%', width: '65%',top:'30%', height: "50%"}];
    console.log("value = ",value);
    // 画图操作
    let chartId = 'main'+index;
    let drawData = value;
    // console.log("createChart -> drawData = ",drawData);
    //TODO 检查是否可以show related charts
    let show_option = [];
    for (let i = 0; i < data_for_show_more.length; i++){
        if (data_for_show_more[i].order1 === drawData.order1 && data_for_show_more[i].order2 !== drawData.order2){
            show_option.push(data_for_show_more[i]);
        }
    }
    console.log("show_option->",show_option);
    //TODO 创建div
    createNewDiv(chartId,show_option);
    //TODO 开始画图操作
    if (drawData.classify.length === 0){//TODO 2列的情况
        if (drawData.chart === "bar")
            createBar(drawData, chartId, gridForSingle, googleLike);
        else  if (drawData.chart === "line")
            createLine(drawData, chartId, gridForSingle, googleLike);
        else  if (drawData.chart === "pie")
            createPie(drawData, chartId, gridForSingle, googleLike);
        else if (drawData.chart === "scatter")
            createScatter(drawData, chartId, gridForSingle, googleLike);
    }
    else {//TODO 3列的情况
        if (drawData.chart === "bar")
            createStackedBar(drawData, chartId, gridForStacked, googleLike);
        else  if (drawData.chart === "line")
            createStackedLine(drawData, chartId, gridForStacked, googleLike);
        else if (drawData.chart === "scatter")
            createStackedScatter(drawData, chartId, gridForStacked, googleLike);
    }

};

var deepEyeSql_Nlp = function (data, ZoomID) {
    let operForY = '';
    if (data.y_name.indexOf('avg')!== -1) {
        // console.log('avg');
        operForY = `calculate the average of <i>${data.y_name}</i>`;
    }
    else if (data.y_name.indexOf('sum') !== -1) {
        // console.log('sum')
        operForY = `calculate the sum of <i>${data.y_name}</i>`;
    }
    else if (data.y_name.indexOf('cnt') !== -1) {
        // console.log('cnt')
        operForY = `count how many value in each bucket <i>${data.x_name} ${data.describe}</i> `;
    }
    else {
        operForY = `<i>${data.y_name}</i>`;
    }

    let bar = '';
    let line = '';
    let pie = '';
    let scatter = '';
    let meaning = '';
    if (data.chart === 'bar'){
        // if (data.)
    }else if (data.chart === 'line'){

    }else if (data.chart === 'pie'){

    }else {

    }
    let query = `<p class="bg-success"> <strong>DeepEye Query:</strong> VISUALIZE <i>${data.chart}</i> SELECT <i>${data.x_name}</i>, <i>${data.y_name}</i> FROM <i>${tableName}</i> ${data.describe} </p>`;
    let nlp =  `<!--<p class="bg-success"><strong>Insight:</strong> This figure visualize column <i>${data.x_name}</i> by ${data.describe} and ${operForY}, tell us that ${meaning}</p>-->`;
    $("#"+ZoomID).append(query);
    // $("#"+ZoomID).append(nlp);
}

var createChartInZoom = function  (value, index, googleLike) {
    let grid = [{x: '20%', width: '70%',y:'22%',height: "64%"}];
    // 画图操作
    let chartId = 'ZoomVis'+index;
    //TODO 创建div
    createNewDivInZoom(chartId,'ZoomVis');
    // console.log("start draw")
    //TODO 开始画图操作
    let drawData = value;
    if (drawData.classify.length === 0) {//TODO 2列的情况
        if (drawData.chart === "bar")
            createBar(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "line")
            createLine(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "pie")
            createPie(drawData, chartId, grid, googleLike);
        else if (drawData.chart === "scatter")
            createScatter(drawData, chartId, grid, googleLike);
    }
    else{//TODO 3列的情况
        if (drawData.chart === "bar")
            createStackedBar(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "line")
            createStackedLine(drawData, chartId, grid, googleLike);
        else if (drawData.chart === "scatter")
            createStackedScatter(drawData, chartId, grid, googleLike);
    }
    //TODO 在zoom 模态框里面增加query 和 natural sentence
    deepEyeSql_Nlp(drawData, 'ZoomVis');
    return  chartId;
};

var createChartInZoomForShowMore = function  (value, index, googleLike) {
    let grid = [{x: '20%', width: '70%',y:'22%',height: "64%"}];
    // 画图操作
    let chartId = 'showMoreVis'+index;
    //TODO 创建div
    createNewDivInZoom(chartId,'showMoreVis');
    // console.log("start draw")
    //TODO 开始画图操作
    let drawData = value;
    if (drawData.classify.length === 0) {//TODO 2列的情况
        if (drawData.chart === "bar")
            createBar(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "line")
            createLine(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "pie")
            createPie(drawData, chartId, grid, googleLike);
        else if (drawData.chart === "scatter")
            createScatter(drawData, chartId, grid, googleLike);
    }
    else{//TODO 3列的情况
        if (drawData.chart === "bar")
            createStackedBar(drawData, chartId, grid, googleLike);
        else  if (drawData.chart === "line")
            createStackedLine(drawData, chartId, grid, googleLike);
        else if (drawData.chart === "scatter")
            createStackedScatter(drawData, chartId, grid, googleLike);
    }
    //TODO 在zoom 模态框里面增加query 和 natural sentence
    deepEyeSql_Nlp(drawData, 'showMoreVis');
    return  chartId;
};
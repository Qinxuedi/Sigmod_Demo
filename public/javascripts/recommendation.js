/**
 * Created by luoyuyu on 2017/12/19.
 */
let data_response_to_draw = [];
let data_for_show_more = [];
const pageSize = 6;
let selectedKeywords = {};

//自动根据数据表推荐，用户没有加入任何选择条件.
function DeepEyeRecommend() {
    //step 1: 如果之前存在DIV，则删除，没有就进入step2  //(列出所有的tag）
    //TODO 删除上一个表的chart和paging
    deleteExistDiv();

    $.ajax({
        method: 'GET',
        url: "visualization/Partial_Order",
        data: {
            tableName: tableName,
        },
        dataType: 'json',
        success: function(response){
            //处理返回的数据
            let data = response.data.split('\n');
            data.pop();
            // console.log("PartialOrder接受后台的data类型:",typeof (data));
            if (data[0] === "{}") {
                //TODO 更新chartAreaTitle
                document.getElementById("chartAreaTitle").innerHTML = '<h4>DeepEye recommendation: ' + `<small>${data.length - 1} visualizations</small></h4>`;
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
                    document.getElementById("chartAreaTitle").innerHTML  = '<h4>DeepEye recommendation:  ' + `<small> 0 visualizations</small></h4>`;
                }else {
                    let pageNum = Math.ceil(data.length / pageSize);
                    //TODO 更新chartAreaTitle
                    document.getElementById("chartAreaTitle").innerHTML  = '<h4>DeepEye recommendation: ' + ` <small>${data.length} visualizations</small></h4>`;
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
                        createChart(value, index);
                    });
                    // 绑定事件
                    $('#chartsContainerPage').find('.pagination li').click(function () {
                        ////TODO step 1: 删除之前已经存在的div
                        deleteExistDiv();
                        let clickPage = parseInt($(this).find('a span').html());
                        $(this).addClass("active");
                        $(this).siblings().removeClass("active");
                        data.slice((clickPage - 1) * pageSize, clickPage * pageSize).forEach((value, index) => {
                        // TODO 画6个图
                        createChart(value, (clickPage-1)*pageSize+index);
                        });
                    });
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("something wrong.");
        }
    });
}

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;
//TODO Check a obj if empty
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


function eventOfZoomMore(event) { //visualization recommendation phase
    "use strict";
    event = event || window.event; //For IE
    if(event.target.className.match(/btnZoom/)){//FOR ZOOM IN BUTTON AND FUNCTION
        let tag = event.target.dataset.echartsbtn; //main0
        let index = event.target.dataset.echartsbtn.substr(4,tag.length);
        // console.log("index = ",index);
        // console.log(data_response_to_draw[index]);
        // 创建模态框
        $(function () {
            $('#ZoomDiv').modal({backdrop: 'static', keyboard: false}, 'show');
            // 画图data[event.target.dataset.echartsbtn]
            createChartInZoom(data_response_to_draw[index], index);
            // 关闭modal的时候删除图
            $('#ZoomDiv').on('hidden.bs.modal', function (e) {
                $("#ZoomVis").html("");
            })
        });
    }

    if (event.target.className.match(/btnShowMore/)){
        // console.log("event.target.dataset.showmore = ",event.target.dataset.showmore);
        //code here
        let order1 = event.target.dataset.showmore; //order1
        let value;
        let curOption = $("."+order1).find("option:selected").text();
        let curChart = curOption.substr(0,curOption.indexOf(','));
        let curY_name = curOption.substr(curOption.indexOf(',')+2, curOption.length);// bar, cnt(date)
        // console.log("order1 ==> ",order1);
        // console.log("curOption ==> ",curOption);
        // console.log("curChart ==>",curChart);
        // console.log("curY_name ==>",curY_name);
        // console.log("data_for_show_more ==>",data_for_show_more);
        for (let i = 0; i < data_for_show_more.length; i++){
            console.log("data_for_show_more = ",data_for_show_more.length);
            if (order1 == data_for_show_more[i].order1 && curChart == data_for_show_more[i].chart && curY_name == data_for_show_more[i].y_name)
                value = data_for_show_more[i];
        }
        // console.log("value ==> ",value);
        // 创建模态框
        $(function () {
            $('#showMoreDiv').modal({backdrop: 'static', keyboard: false}, 'show');
            createChartInZoomForShowMore(value, order1);
            // 关闭modal的时候删除图
            $('#showMoreDiv').on('hidden.bs.modal', function (e) {
                $("#showMoreVis").html("");
            })
        });
    }
}

$("#chartsContainer").click(function (event) {
    eventOfZoomMore(event);
});

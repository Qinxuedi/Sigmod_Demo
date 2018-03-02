/**
 * Created by luoyuyu on 2017/11/27.
 */
$("#NL2Vis").click(function () { //点击了submit按钮，开始获取input内容，返回给后台判断，然后让前台检验.
    $.ajax({
        url: '/visualization/NL2Vis',
        type: 'GET',
        data: {
            info : "Using natural language to construct query and then refine it.",
            tableName: tableName,
            query: $("#KeywordQuery").val() //获取用户输入的query
        },
        dataType: 'json',
        success: function(data){
            console.log("后台返回的数据:",data);
            //1. 解析后台返回的数据，如果后台不能理解用户输入的查询语言，则提示用户换一种方式重新输入
            //2. 如果后台能理解用户输入的查询语言，则在模态框让用户再检查一遍
            
            selectedKeywords = {
                "visType" : data[0].success.VisualizationType,
                "selectedAttr": data[0].success.Attributes,
                "selectedAgg": data[0].success.Aggregates,
                "otherFeatures": data[0].success.OtherFeatures
            };
            console.log(selectedKeywords);

            //2. stone this Object and check in my-jQuery-function.js
            DeepEyeRecommend();

            //3.deleteExistQueryDiv();
            deleteExistQueryDiv();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert("something wrong!")
        }
    });

});

function renderVisType(data) {
    let visHtml =
        `<form>
              <div class="form-group">
                    <p><b>Visualization Type:</b></p>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="bar" class="visType"/> Bar Chart
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="line" class="visType"/> Line Chart
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="pie" class="visType"/> Pie Chart
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="scatter" class="visType"/> Scatter Chart
                    </label>
              </div>
        </form>`;
    let html = document.createElement('div');
    html.innerHTML = visHtml;
    html.className = "removeQueryDiv"; //删除DIV，防止多次生成
    document.getElementById("CheckKeywordQuery").appendChild(html);
    if (data[0].success.VisualizationType.length == 0){// 1. Not fixed vis type -> checked all checkbox in visType
        $("[class='visType']").attr("checked",'true');//全选
    }
    else {
        if (data[0].success.VisualizationType.indexOf('bar') != -1){
            $("[name='bar']").attr("checked",'true');//checked
        }
        if (data[0].success.VisualizationType.indexOf('line') != -1){
            $("[name='line']").attr("checked",'true');//checked
        }
        if (data[0].success.VisualizationType.indexOf('pie') != -1){
            $("[name='pie']").attr("checked",'true');//checked
        }
        if (data[0].success.VisualizationType.indexOf('scatter') != -1){
            $("[name='scatter']").attr("checked",'true');//checked
        }
    }
}

function renderAttributes(data) {
    let attrHtml =
        `<form>
              <div class="form-group" id="attributes">
                <p><b>Selected Attributes:</b></p>
              `;
    for (let i = 0; i < data[0].columnName.length; i++) {
        attrHtml += `<label class="checkbox-inline"><input type="checkbox" class="selectedAttr" name=${data[0].columnName[i]}>${data[0].columnName[i]}</label>`
    }
    attrHtml += `</div></form>`;
    let html = document.createElement('div');
    html.innerHTML = attrHtml;
    html.className = "removeQueryDiv"; //删除DIV，防止多次生成
    document.getElementById("CheckKeywordQuery").appendChild(html);
    if (data[0].success.Attributes.length == 0) {// 1. Not fixed vis type -> checked all checkbox in visType
        $("[class='selectedAttr']").attr("checked", 'true');//全选
    }
    else {
        for (let i = 0; i < data[0].success.Attributes.length; i++) {
            $(`[name=${data[0].success.Attributes[i]}]`).attr("checked",'true');//checked
        }
    }
}

function renderAggregates(data) {
    "use strict";
    let aggHtml =
        `<form>
              <div class="form-group">
                    <p><b>Selected Aggregates:</b></p>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="avg" class="selectedAgg"/> AVG(&nbsp;)
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="sum" class="selectedAgg"/> SUM(&nbsp;)
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="count" class="selectedAgg"/> COUNT(&nbsp;)
                    </label>
              </div>
         </form>`;

    let html = document.createElement('div');
    html.innerHTML = aggHtml;
    html.className = "removeQueryDiv"; //删除DIV，防止多次生成
    document.getElementById("CheckKeywordQuery").appendChild(html);
    if (data[0].success.Aggregates.length == 0) {// 1. Not fixed vis type -> checked all checkbox in visType
        $("[class='selectedAgg']").attr("checked", 'true');//none
    }
    else {
        if (data[0].success.Aggregates.indexOf('count') != -1){
            $("[name='count']").attr("checked",'true');//checked
        }
        if (data[0].success.Aggregates.indexOf('sum') != -1){
            $("[name='sum']").attr("checked",'true');//checked
        }
        if (data[0].success.Aggregates.indexOf('avg') != -1){
            $("[name='avg']").attr("checked",'true');//checked
        }
    }
}

function renderOtherFeatures(data) {
    "use strict";
    "use strict";
    let aggHtml =
        `<form>
              <div class="form-group">
                    <p><b>Other Features:</b></p>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="correlation" class="otherFeatures"/> Correlation
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="relationship" class="otherFeatures"/> Relationship
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="trend" class="otherFeatures"/> Trend
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="positive" class="otherFeatures"/> Positive
                    </label>
                    <label class="checkbox-inline">
                      <input type="checkbox" name="negative" class="otherFeatures"/> Negative
                    </label>
              </div>
        </form>`;
    let html = document.createElement('div');
    html.innerHTML = aggHtml;
    html.className = "removeQueryDiv"; //删除DIV，防止多次生成
    document.getElementById("CheckKeywordQuery").appendChild(html);
    for (let i = 0; i < data[0].success.OtherFeatures.length; i++) {
        $(`[name=${data[0].success.OtherFeatures[i]}]`).attr("checked",'true');//checked
    }
    for (let i = 0; i < data[0].success.VisualizationType.length; i++){
        if (data[0].success.VisualizationType[i] == 'line')
            $(`[name=trend]`).attr("checked",'true');//checked
        if (data[0].success.VisualizationType[i] == 'scatter')
            $(`[name=correlation]`).attr("checked",'true');//checked
    }
}

function renderQuery(data) {
    console.log("Keyword->data",data);
   //1. deal with visualization type.
    renderVisType(data);

   //2. deal with selected attributes.
    renderAttributes(data);

   //3. deal with aggregates
    renderAggregates(data);

   //4. deal with other features
    renderOtherFeatures(data)
}

function deleteExistQueryDiv() {
    if($(".removeQueryDiv").length > 0){
        $(".removeQueryDiv").remove();
    }
}

$(".btn_checkQueryNo").click(function (){
    deleteExistQueryDiv();
});

$("#btn_checkOk").click(function () {
    selectedKeywords = {
        "visType" : [],
        "selectedAttr": [],
        "selectedAgg": [],
        "otherFeatures": []
    };
    //1. Refine Query and Process (Collect all selected checkbox)
    //1.1 visType
    for(k in $(".visType")){
        if($(".visType")[k].checked)
            selectedKeywords.visType.push($(".visType")[k].name)
    }

    //1.2 selectedKeywords
    for(k in $(".selectedAttr")){
        if($(".selectedAttr")[k].checked)
            selectedKeywords.selectedAttr.push($(".selectedAttr")[k].name)
    }

    //1.3 selectedAgg
    for(k in $(".selectedAgg")){
        if($(".selectedAgg")[k].checked)
            selectedKeywords.selectedAgg.push($(".selectedAgg")[k].name)
    }

    //1.4 otherFeatures
    for(k in $(".otherFeatures")){
        if($(".otherFeatures")[k].checked)
            selectedKeywords.otherFeatures.push($(".otherFeatures")[k].name)
    }
    console.log(selectedKeywords);

    //2. stone this Object and check in my-jQuery-function.js
    DeepEyeRecommend();

    //3.deleteExistQueryDiv();
    deleteExistQueryDiv();
});
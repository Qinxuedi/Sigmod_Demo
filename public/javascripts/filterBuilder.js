/**
 * Created by luoyuyu on 2017/12/17.
 */
//https://segmentfault.com/q/1010000000486619
//事件委托机制。 监听用户选择去过滤的列名
$("#filterBuilder").on('click','#filterBtn',function () {
    "use strict";
    console.log("filter start")
    if ($(this).attr("class").indexOf('filterNumerical') != -1){
        alert("developing")
    }
    if ($(this).attr("class").indexOf('filterCategory') != -1){
        alert("developing")
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
            if (data.type == "numerical"){
                $("#"+addFilterBuilderID).empty();
                let html = `<div class="panel panel-default">
                  <div class="panel-heading">
                    <h5 class="panel-title">${getColumnNameID}</h5>
                  </div>
                  <div class="panel-body" style="max-height:10em;overflow-y: scroll;">
                    <table class="table table-condensed table-bordered">
                      <thead>
                        <tr>
                          <td>Mix</td>
                          <td>Max</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input id="minValue" type="number" placeholder=${data.value[0]} class="form-control input-sm"/>
                          </td>
                          <td>
                            <input id="maxValue" type="number" placeholder=${data.value[1]} class="form-control input-sm"/>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>`;
                html += '</div></div>' +
                    '<button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block filterNumerical">' +
                    '<span class="glyphicon glyphicon glyphicon-play-circle"></span>  Filter Now' +
                    '</button>';
                $("#"+addFilterBuilderID).append(html);
            }
            if (data.type == "category" || data.type == "date"){
                //清空原来的
                $("#"+addFilterBuilderID).empty();
                let html = `<div class="panel panel-default">
                  <div class="panel-heading">
                    <h5 class="panel-title">${getColumnNameID}</h5>
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
                    html += '</div></div>' +
                        '<button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block filterCategory">' +
                        '<span class="glyphicon glyphicon glyphicon-play-circle"></span>  Filter Now' +
                        '</button>';
                         $("#"+addFilterBuilderID).append(html);

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
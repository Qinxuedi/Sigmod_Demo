/**
 * Created by luoyuyu on 2017/12/17.
 */
$(".filterColumns").click(function () {
    // alert($(this).parent().text());//查看被选中进行过滤的列名
    filterBuilder($(this).parent().text(),'filterBuilder');
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
function filterBuilder(getColumnNameID, addFilterBuilderID) {
    //get Column Type
    //1. if numerical
    //2. if category
    //3. if date
    //get Column Value

    //filter build


    //Static builder
    "use strict";
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
    <div class="input-group input-group-sm" id="searchInputDiv"></div>
    <div class="checkbox filterCheckbox">
        <label>
          <input type="checkbox" class="filterCheckbox"> UA
        </label>
    </div>
    <div class="checkbox filterCheckbox">
        <label>
          <input type="checkbox" class="filterCheckbox"> MU
        </label>
    </div>
    <div class="checkbox filterCheckbox">
        <label>
          <input type="checkbox" class="filterCheckbox"> AA
        </label>
    </div>
  </div>
</div>`;

    html += `
    <div class="panel panel-default">
  <div class="panel-heading">
    <h5 class="panel-title">${getColumnNameID}</h5>
  </div>
  <div class="panel-body">
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
            <input id="minValue" type="number" placeholder="0" class="form-control input-sm"/>
          </td>
          <td>
            <input id="maxValue" type="number" placeholder="100" class="form-control input-sm"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
    <button type="button" id="filterBtn" aria-label="Left Align" class="btn btn-default btn-block">
        <span class="glyphicon glyphicon glyphicon-play-circle"></span>  Filter Now
    </button>
`;
    $("#"+addFilterBuilderID).append(html)
}
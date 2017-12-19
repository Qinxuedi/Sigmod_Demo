/**
 * Created by luoyuyu on 2017/12/17.
 */
var temData;   //全局变量，存储从数据库中返回的 table 数据 十分重要！(表格中的数据)
var tableName = "";
var varColName = [];
var colTypeOfUploadExtraData = [];
var $table = $('#table'); //用于检验表格列的类型的table id
var $table1 = $('#table_id1') //用于展示已经上传了的数据表格的id
$("#dataBtn").click(function () {
    $('#dataModal').modal({backdrop: 'static', keyboard: false}, 'show');
    //alert("In order to reduce the server pressure, we limits the user upload files in this version.")
});



//For file input / upload function
//For file input / upload function
function rowStyle(row, index) {
    var classes = ['active', 'success', 'info', 'warning', 'danger'];
    if (index === 0) {
        return {
            classes: classes[0]
        };
    }
    return {};
}
function addSuccessfulInfo(id) {
    if(id === 0){
        $("#table_id1").after(
            '<div id = "alert" role="alert" class="alert alert-success">' +
            '<strong>Well done!</strong> ' +
            'You have loaded this table successfully !' +
            '</div>'
        );
        setTimeout(function () {
            $("#alert").remove();
            $('#uploadModal').modal('hide')
        }, 1500);
    }
    if(id === 1){
        $("#input-id").after(
            '<div id = "alert" role="alert" class="alert alert-success">' +
            '<strong>Well done!</strong> ' +
            'You have uploaded a csv file successfully !  Now, you can check this in tab' +
            '<strong> "Data Sets".</strong>'+
            '</div>'
        );
        setTimeout(function () {
            $("#alert").remove();
        }, 3500);
    }
    if (id === 2){
        $("#table_id1").after(
            '<div id = "alert" role="alert" class="alert alert-success">' +
            '<strong>Well done!</strong> ' +
            'You have selected a csv file successfully !  Now, you can see this in tab' +
            '<strong> "Dashboard".</strong>'+
            '</div>'
        );
        setTimeout(function () {
            $("#alert").remove();
        }, 3500);
    }
    if (id === 3){
        $("#table_id1").after(
            '<div id = "alert" role="alert" class="alert alert-danger">' +
            '<strong>Well done!</strong> ' +
            'You have deleted a csv file successfully !'+
            '</div>'
        );
        setTimeout(function () {
            $("#alert").remove();
        }, 2500);
    }
    if (id === 4){
        $("#table_id2").after(
            '<div id = "alert" role="alert" class="alert alert-success">' +
            '<strong>Well done!</strong> ' +
            'successfully !  Now, you can see this in tab' +
            '<strong> "Visualization Results".</strong>'+
            '</div>'
        );
        setTimeout(function () {
            $("#alert").remove();
        }, 3500);
    }
}

function findType(x) // check the field type
{
    let date_patt = new RegExp(/^(?:(?:1[6-9]|[2-9][0-9])[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))$/);
    if(!x)
    {
        console.log("Null values cannot be added into the table!!");
        return;
    }
    if(!isNaN(x))
    {
        let n = Number(x);
        if(n % 1 === 0)
            if (x.length === 4)
                return "Year"
            else return "Int"
        else
            return "Float";
    }
    else
    {
        if(date_patt.test(x))
        {
            return("Date");
        }
        else {
            if(x.length <45) return("Varchar");
            else  return "String"
        }
    }
}

function detectFieldTypeAndUpdate(colName,colType) {
    let DateSelect ='<select class="form-control selector"><option id = "TIMESTAMP" selected="selected" >DATETIME</option> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE" selected="selected" >DATE</option> <option id="INT">INT</option> <option id="FLOAT">FLOAT</option> <option id="VARCHAR">VARCHAR(125)</option> <option id="STRING">STRING</option> <option id="YEAR">YEAR</option></select> '
    let IntSelect ='<select class="form-control selector"> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE"  >DATE</option> <option id="INT" selected="selected">INT</option> <option id="Float">FLOAT</option> <option id="VARCHAR">VARCHAR(125)</option> <option id="STRING">STRING</option> <option id="YEAR">YEAR</option></select> '
    let FloatSelect ='<select class="form-control selector"> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE"  >DATE</option> <option id="INT" >INT</option> <option id="FLOAT" selected="selected">FLOAT</option> <option id="VARCHAR">VARCHAR(125)</option> <option id="STRING">STRING</option> <option id="YEAR">YEAR</option></select> '
    let VarcharSelect ='<select class="form-control selector"> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE" >DATE</option> <option id="INT">INT</option> <option id="FLOAT">FLOAT</option>  <option id="VARCHAR" selected="selected">VARCHAR(125)</option> <option id="STRING">STRING</option> <option id="YEAR">YEAR</option></select> '
    let StringSelect ='<select class="form-control selector"> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE" >DATE</option> <option id="INT">INT</option> <option id="FLOAT">FLOAT</option>  <option id="VARCHAR">VARCHAR(125)</option> <option id="STRING" selected="selected">STRING</option><option id="YEAR">YEAR</option></select> '
    let YearSelect ='<select class="form-control selector"> <option id = "DATETIME" selected="selected" >DATETIME</option> <option id = "DATE" >DATE</option> <option id="INT">INT</option> <option id="FLOAT">FLOAT</option>  <option id="VARCHAR">VARCHAR(125)</option> <option id="STRING" >STRING</option><option id="YEAR" selected="selected">YEAR</option></select> '
    let obj = {};
    for (let i=0;i<colType.length;i++){
        if (findType(colType[i]) === "Date") obj[colName[i]] = DateSelect;
        else if(findType(colType[i]) === "Int") obj[colName[i]] = IntSelect;
        else if(findType(colType[i]) === "Float") obj[colName[i]] = FloatSelect;
        else if(findType(colType[i]) === "String") obj[colName[i]] = StringSelect;
        else if(findType(colType[i]) === "Year") obj[colName[i]] = YearSelect;
        else  obj[colName[i]] = VarcharSelect;
    }
    $table.bootstrapTable('insertRow', {
        index: 0,
        row: obj
    });
}


function selectFieldType(colName,colType,data) {
    let columns = [];
    for (let i = 0; i < colName.length; i++) {
        columns.push({
            field: colName[i],
            title: colName[i],
            // sortable: true
        })
    }
    $table.bootstrapTable('destroy').bootstrapTable({
        data: data,
        pagination: true,
        // search: true,
        // showColumns: true,
        showHeader: true,
        rowStyle:rowStyle,
        columns: columns
    });
    $(function () {
        $('#modalTable').modal({backdrop: 'static', keyboard: false},'show');
        $('#modalTable').on('shown.bs.modal', function () {
            $table.bootstrapTable('resetView');
        });
    });
    //更新列的类型值选项
    detectFieldTypeAndUpdate(colName,colType)
};

$("#btn_changeFieldType").click(function () {
    colTypeOfUploadExtraData= [];
    $(".selector").each(function () {
        colTypeOfUploadExtraData.push($(this).val());
    });
    console.log("colTypeOfUploadExtraData = ",colTypeOfUploadExtraData);
});

//上传文件 插件相关代码
var $input = $('#input-id');
//0. 开始配置文件上传代码.
//1. 首先要提示让用户验证csv文件的每列数值类型（算法自动检测数据类型，用户在valid这个数据类型）.
//2. 然后开始将数据上传到服务器（process bar 1）.
//3. 文件上传服务器成功后，再写入到mysql服务器（process bar 2）.
//4. 根据服务器对数据文件的处理结果，友好地返回结果给前端服务器; 提示用户 a.上传成功||失败 b.写入成功||失败
$("#uploadBtn").click(function () {
    $('#uploadModal').modal({backdrop: 'static', keyboard: false}, 'show');
    //alert("In order to reduce the server pressure, we limits the user upload files in this version.")
});


$("#input-id").fileinput({
    uploadUrl: "/data/import", // server upload action
    uploadAsync: true,
    showPreview: true,
    showUploadedThumbs: false,//boolean, whether to persist display of the uploaded file thumbnails in the preview window (for ajax uploads) until the remove/clear button is pressed
    maxFileCount: 1,
    showBrowse: false,
    browseOnZoneClick: true,
    maxFileSize: 1024*10, //限制文件大小：1024KB*10.
    allowedFileTypes: ['csv'], //改写了插件，增加了csv类型
    fileActionSettings:{
        'showZoom' : false,
        'indicatorNew' : '1234'
    },
    uploadExtraData: function () {
        return  colTypeOfUploadExtraData;
    }
});

$('#input-id').on('fileloaded', function (event, file, previewId, index, reader) {
    // 检查文件名字是否过长
    let fileNameLength = file.name.length;
    if (fileNameLength >= 41){
        $('#input-id').after('<div id = "alert" role="alert" class="alert alert-danger">' +
            '<strong>Alert!</strong> ' +
            'File Name must have at most 45 characters' +
            '</div>');
        $input.fileinput('lock');
        setTimeout(function () {
            $input.fileinput('reset').fileinput('unlock');
            $("#alert").remove();
        }, 2500);
    }
    else{
        let data = reader.result.split('\n');
        let dataLength = data.length > 8 ? 8 : data.length;
        let colName = data[0].split(',');
        let colData = [];
        for (let i = 1;i<dataLength;i++){
            let rowJSON = {};
            for (let j=0;j<colName.length;j++){
                rowJSON[colName[j]] = data[i].split(',')[j];
            }
            colData.push(rowJSON);
        }
        selectFieldType(colName,data[3].split(','),colData);
    }
});

$('#input-id').on('fileuploaded', function (event, data, previewId, index) {
    "use strict";
    let response = data.response; //后台反馈的信息
    console.log(response);
    //TODO 0. 文件上传成功之后，将之前的文件清空，释放空间
    addSuccessfulInfo(1); //给用户提示
    setTimeout(function () {
        $input.fileinput('reset').fileinput('unlock');
    },500);
});

//获取已经上传的数据文件/get data/ cloud data
//1. Bootstrap - table 相关函数
//监听events 主要是监听选中按钮
window.operateEvents = {
    'click .selectCloudData': function (e, value, row, index) {
        console.log("row.tableID = ",row.tableID);
        //TODO 更新两处地方的tableName,然后关闭模态框
        tableName = row.tableID;
        $("#selectedTableName").text(tableName);
        //给出加载成功提示关闭模态框
        addSuccessfulInfo(0);
        //1.选中表格，切换数据(这这里应该是调用后台算法画图)
    }
};
function operateFormatter(value, row, index) {
    return [
        '<button type="button" class="btn btn-default selectCloudData" aria-label="Left Align" title="selectCloudData">',
        '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>',
        '</button>'
    ].join('');
}
//2. 通过Bootstrap - table 接口来查询数据库并且返回
//TODO 加载服务器数据库中已经存在的数据表/files
$("#uploadBtn").click(function () {
    $table1.bootstrapTable('destroy').bootstrapTable({
        url: '/data/req_allTable',
        method: 'get',
        pagination: true,
        search: true,
        showColumns: true,
        clickToSelect: true,
        showToggle: true,
        columns: [
            {
                field: "tableID",
                title: "Table Name",
                sortable: true,
            },
            {
                field: "fileType",
                title: "Type",
                sortable: true,
            },
            {
                field: "creTime",
                title: "Created Time",
                sortable: true,
            },
            {
                field: "#",
                title: "#",
                align: 'center',
                events: operateEvents,
                formatter: operateFormatter
            }
        ]
    });
});

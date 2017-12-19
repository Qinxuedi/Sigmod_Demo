/**
 * Created by luoyuyu on 2017/12/17.
 */
var express = require('express');
var router = express.Router();
var myFunction = require('../routes/my-function');
var pool = require('../mysql/dbConfig');
var tablePool = require('../mysql/dbTable');
//csv
var fs = require('fs');
var csv = require('fast-csv');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'DeepEye' });
});

router.post('/import', function(req, res, next) {
    console.log("Have receive a upload request successfully!");
    // 访问数据库是异步操作，注意.

    console.log(req.body); //receive 'uploadExtraData', which contains the column type.

    console.log(req.files);

    // 文件上传代码
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let data = req.files.kartik_input;
    let fileName = data.name;  // 上传的文件名;
    let colType = Object.values(req.body).slice(0,Object.keys(req.body).length-1);
    console.log("column type ==> "+colType);
    data.mv('./uploadFiles/'+fileName, function(err) {
        //在 mv 的回调函数里面执行相应操作
        // if (err)
        //     return res.status(500).send(err);

        //去掉文件后缀(.csv)
        fileName = fileName.replace(/.csv$/,"");
        console.log("fileName:"+fileName);
        let creTime = new Date().toLocaleDateString();
        let modTime = new Date().toLocaleDateString();
        let id = fileName;
        let colName = [];
        // let colType = [];
        let insertSQL = "INSERT INTO `tableInfo`" + " (`id`,`tableID`,`userID`,`creTime`,`modTime`) VALUES ('" +id+"', '"+fileName+"', '"+userID+"', '"+creTime+"', '"+modTime+"')";
        new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                if (err) reject(err);
                else {
                    connection.query(insertSQL, function(err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send(err);
                        }
                        else {
                            myFunction.importFiles(userID,fileName,colName,colType,function (colName) {
                                console.log("colName: " + colName);
                                if(colName === null) {
                                    console.log("err === null");
                                    res.json(['error']);
                                }else{
                                    console.log("colName -> success");
                                    resolve(colName);
                                }
                            })
                        }
                        connection.release();

                    })
                }
            })
        })
            .then(
                (colName) => {
                    res.send(['upload file done.']);
                    console.log("upload file done after 2 Promise")
                }
            )
            .catch((err) => console.log(err)); //返回给前端浏览器的信息
        //0. 通过POST处理文件上传请求.
        //1. 将上传文件存储到服务器中 （1、2的先后顺序一定要保证）.
        //2. 将该文件信息写入到数据库里面，并给用户成功的提示. 同时判断csv文件的field type

    });
});

router.get('/req_allTable', function(req, res, next){
    myFunction.getUserUploadedTables().then((data) => res.send(data)).catch((err) => console.log(err)); //返回给前端浏览器的信息
});

module.exports = router;
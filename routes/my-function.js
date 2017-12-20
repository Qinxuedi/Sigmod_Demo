/**
 * Created by luoyuyu on 2017/8/17.
 */
var tablePool = require('../mysql/dbTable');
var pool = require('../mysql/dbConfig');
var fs = require('fs');
var csv = require('fast-csv');
var path = require('path');

module.exports.getTableColumnNames = function (tableID) {
    return new Promise((resolve, reject) => {
        "use strict";
        let columnName = [];
        tablePool.getConnection(function (err,connection) {
            if (err) reject(err);
            else {
                connection.query('DESCRIBE '+"`"+tableID+"`",function (err,result) {
                    if (err) reject(err);
                    else {
                        console.log("1.describe table");
                        //code here
                        for (let i = 0; i < result.length; i++){
                            columnName.push(result[i].Field);
                        }
                        console.log("columnName:",columnName);
                        resolve(columnName);
                    }
                    connection.release();
                })
            }
        })
    })
};


module.exports.getUserUploadedTables = function () {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err,connection) {
            if (err) reject(err);
            else {
                connection.query("select * from tableInfo",function (err,result) {
                    if (err) reject(err);
                    else {
                        resolve(result);
                    }
                    connection.release();
                })
            }
        })
    })
};

module.exports.getTableByIDServerSidePagination = async function (tableID, limit, offset) {
    let rows = [];
    await new Promise((resolve, reject) => {
        tablePool.getConnection(function (err,connection) {
            if (err) reject(err);
            else {
                connection.query("select * from "+"`"+tableID+"` limit "+offset+","+limit,function (err,result) {
                    if (err) reject(err);
                    else {
                        // console.log(result)
                        rows = result;
                        resolve(result);
                    }
                    connection.release();
                })
            }
        })
    });
    return new Promise((resolve, reject) => {
        tablePool.getConnection(function (err,connection) {
            if (err) reject(err);
            else {
                connection.query("select count(*) from "+"`"+tableID+"`",function (err,result) {
                    if (err) reject(err);
                    else {
                        let data = [];
                        data['rows'] = rows;
                        data['total'] = result[0]['count(*)'];
                        resolve(data);
                    }
                    connection.release();
                })
            }
        })
    })
};

//module.exports.importFiles = function (userID,tableID, callback) {
module.exports.importFiles = function (userID,tableID,colName,colType,callback) {
    "use strict";
    let csvPath = path.join(__dirname,'../','uploadFiles/',tableID+'.csv');
    tablePool.getConnection(function (err,connection) {
        if (err){
            //callback(err);
            return;
        }else {
            let count = 1;
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data',function (data) {
                    if (count === 1) colName = data;
                    else {
                        let createSQL = "CREATE TABLE IF NOT EXISTS "+'`'+userID+"@"+tableID+'` (';
                        for (let i=0;i<colName.length;i++){
                            createSQL+='`'+colName[i]+'`';
                            createSQL+=' ';
                            createSQL+= colType[i];
                            if (i!=colName.length-1){
                                createSQL+=', ';
                            }
                        }
                        createSQL+=') character set = utf8;';
                        console.log("createSQL : " + createSQL);

                        try {
                            connection.query(createSQL,function (err,result,res) {  //加转义字符 ` `，可以让特殊符号插入mysql
                                if(err){
                                    console.log("CREATE TABLE-something WRONG");
                                    // throw err;
                                    //callback(err);
                                    return;
                                }else {
                                    console.log("count = ",count)
                                    if (count !== 1){
                                        let insertSQL= "INSERT INTO "+'`'+userID+"@"+tableID+'` (';
                                        for (let i = 0; i< colName.length; i++){
                                            insertSQL += '`'+colName[i]+'`';
                                            if (i!=colName.length-1){
                                                insertSQL+=', ';
                                            }
                                        }
                                        insertSQL += ') VALUES (';
                                        for (let i = 0; i< data.length; i++){
                                            if (data[i]=='' || data==undefined){   // 自定义数据为空的情况
                                                data[i]='null';
                                            }
                                            insertSQL += '"'+data[i]+'"';
                                            if (i!=data.length-1){
                                                insertSQL+=', ';
                                            }
                                        }
                                        insertSQL += ');';
                                        console.log(insertSQL);
                                        try{
                                            //如果成功，则进行下面的INSERT操作。但是一定要注意字符串拼接过程中的空格
                                            connection.query(insertSQL, //加转义字符 ` `，可以让特殊符号插入mysql
                                                function (err) {
                                                    if(err) {
                                                        console.log(err);
                                                        // throw err;
                                                        //callback(err);
                                                        return;
                                                    }
                                                });
                                        }catch (err) {
                                            //callback(err);
                                            return;
                                        }
                                    }
                                }
                            });
                        } catch (err) {
                            //callback(err);
                            return;
                        }
                    }

                    count++;

                })
                .on('end',function (data) {
                    console.log('Read finished');
                    callback(colName);
                });

            connection.release();
            console.log("connection.release();");
        }
    });
};


// function checkExistedTable(userID,tableID) {
//     let sql = "SELECT COUNT(*) AS num FROM tableInfo WHERE userID = ? AND tableID = ?";
//         pool.getConnection(function(err, connection){
//             connection.query(sql, [userID], [tableID], function (err, result) {
//                 if (err) {
//                     console.log("getTableNumByName Error: " + err.message);
//                     return;
//                 }
//                 connection.release();
//                 console.log("get table if exist.");
//                 callback(err,result);
//             });
//         });
//         console.log("connection close.");
// }

// function dropIfExistedTable(userID,tableID) {
//     console.log("dropIfExistedTable")
//     return new Promise((resolve) =>{
//         "use strict";
//         tablePool.getConnection(function(err, connection) {  // 只能删除一次 //在往mysql插入表格之前，要先检查是否存在同名的表格，如果存在则删除，再创建新表
//             if (err) throw err;
//             else {
//                 connection.query("DROP TABLE IF EXISTS "+'`'+userID+"@"+tableID+'`', function(err, result) {
//                     if (err) throw err;
//                     else {
//                         console.log("check if have repeated table");
//                         resolve();
//                     }
//                     connection.release(); // 释放连接
//                 })
//             }
//         })
//     })
// }
// function createTable(userID,tableID,colName) {
//     console.log("colName ==> "+colName)
//     console.log("createTable")
//     let createSQL = "CREATE TABLE IF NOT EXISTS "+'`'+userID+"@"+tableID+'` (';
//     for (let i=0;i<colName.length;i++){
//         createSQL+='`'+colName[i]+'`';
//         createSQL+=' ';
//         createSQL+= 'VARCHAR(100)';
//         if (i!=colName.length-1){
//             createSQL+=', ';
//         }
//     }
//     createSQL+=') character set = utf8;';
//     console.log("createSQL : " + createSQL);
//     return new Promise((resolve) => {
//         tablePool.getConnection(function(err, connection) {
//             if (err) reject(err);
//             else {
//                 connection.query(createSQL, function(err, result) {
//                     if (err) throw err;
//                     else {
//                         resolve(result);
//                     }
//                     connection.release();
//                 })
//             }
//         })
//     });
// }
//
// function insertData(userID,tableID,colName,row) {
//     //row is an array.
//     // console.log("insertData"); // (`sessionID`, `userID`) VALUES ('1', '22')
//     let insertSQL= "INSERT INTO "+'`'+userID+"@"+tableID+'` (';
//     for (let i = 0; i< colName.length; i++){
//         insertSQL += '`'+colName[i]+'`';
//         if (i!=colName.length-1){
//             insertSQL+=', ';
//         }
//     }
//     insertSQL += ') VALUES (';
//     for (let i = 0; i< row.length; i++){
//         insertSQL += row[i];
//         if (i!=row.length-1){
//             insertSQL+=', ';
//         }
//     }
//     insertSQL += ');'
//     // console.log("insertSQL ==> ",insertSQL);
//     try{
//         tablePool.getConnection(function(err, connection) {
//             if (err) throw err;
//             else {
//                 connection.query(insertSQL, function(err) {
//                     if (err) throw err;
//                     else {
//                         console.log("insert successfully.")
//                         return true;
//                     }
//                 })
//             }
//         })
//     }catch (err) {
//         throw err;
//         return;
//     }
//
// }
//
// async function csv2mysql (userID,tableID){
//     // 如果存在相同的表格，则删除
//     await dropIfExistedTable(userID,tableID);
//
//     let csvPath = path.join(__dirname,'../','uploadFiles/',tableID);
//     //去除 .csv 后缀
//
//     let line = 1;
//     let colName;
//
//     // tablePool.getConnection(function (err,connection) {
//     //     fs.createReadStream(csvPath)
//     //         .pipe(csv())
//     //         .on("data", function(data){
//     //             "use strict";
//     //             if (line === 1 ){ // 创建表
//     //                 colName = data;
//     //                 createTable(userID,tableID,colName).then(console.log("create successfully!")).catch((err) => console.log(err));
//     //             }
//     //             if (line !== 1){ // 插入表
//     //                 insertData(userID,tableID,colName,data);
//     //             }
//     //             line++;
//     //         })
//     //         .on("end", function(){
//     //             console.log("done");
//     //         });
//     // })
//
//     var stream = fs.createReadStream(csvPath);
//
//     csv
//         .fromStream(stream)
//         .transform(function(data, next){
//             "use strict";
//             if (line === 1 ){ // 创建表
//                 colName = data;
//                 createTable(userID,tableID,colName).then(next()).catch((err) => console.log(err));
//             }
//             if (line !== 1){ // 插入表
//                 if (insertData(userID,tableID,colName,data) === true) next();
//             }
//             line++;
//         })
//         .on("data", function(data){
//             console.log(data);
//         })
//         .on("end", function(){
//             console.log("done");
//         });
//
//     console.log(csvPath)
// }



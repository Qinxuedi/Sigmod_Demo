/**
 * Created by luoyuyu on 2018/2/27.
 */
var express = require('express');
var router = express.Router();
var myFunction = require('../routes/my-function');
var pool = require('../mysql/dbConfig');
var tablePool = require('../mysql/dbTable');
const spawn = require('child_process').spawn;


router.get('/',async function (req, res, next) {
    "use strict";
    let filterData = req.query.selectedDataAfterFilter;
    let tableName = req.query.tableName;
    // console.log(filterData);

    let columnName = [];
    let columnType = [];
    let reqSql = "";
    let colName = [];
    let colType = [];
    let columnNameType = [];
    try {
        await new Promise((resolve, reject) => {
            pool.getConnection(function (err,connection) {
                if (err) reject(err);
                else {
                    connection.query('DESCRIBE '+"`"+tableName+"`",function (err,result) {
                        if (err) reject(err);
                        else {
                            console.log("1.describe table");
                            //code here
                            for (let i = 0; i < result.length; i++){
                                columnName.push(result[i].Field);
                                columnType.push(result[i].Type);
                            }
                            resolve(result);
                        }
                        connection.release();
                    })
                }
            })
        })
    }catch (err){
        console.log(err);
    }
    console.log("columnName = ",columnName);
    console.log("columnType = ",columnType);

    //TODO column selection
    for (let i = 0; i < columnName.length; i++){
        colName.push(columnName[i]);
        colType.push(columnType[i]);
    }
    for (let i = 0; i < colName.length; i++){
        columnNameType.push(colName[i]);
    }
    for (let i = 0; i < colType.length; i++){
        columnNameType.push(colType[i]);
    }

    //Construct the query -- start
    reqSql = 'SELECT * FROM '+"`"+tableName+"`"+' WHERE';
    let cnt = 0;
    for (let key in filterData){

        console.log(key)
        console.log("columnType[columnName.indexOf(key)] = ",columnType[columnName.indexOf(key)])
        if (columnType[columnName.indexOf(key)] == 'float' || columnType[columnName.indexOf(key)].indexOf('int') != -1){ //for numerical
            if (filterData[key]['min'] != undefined && filterData[key]['max'] != undefined){
                reqSql += " `" + key + "` >= " + filterData[key]['min'] + " AND `" + key + "` <= " + filterData[key]['max'];
            }
            else if (filterData[key]['min'] == undefined ){
                reqSql += " `" + key + "` <= " +  filterData[key]['max'] ;
            }
            else {
                reqSql += " `" + key + "` >= " + filterData[key]['min'] ;
            }
            console.log("n-reqSql = ",reqSql)
        }else {//for date & category
            console.log(filterData[key]);
            for (let i = 0; i < filterData[key].length; i++){
                reqSql += " `" + key + "`" + ' LIKE ' + "'" + filterData[key][i] + "'";
                if (i != filterData[key].length - 1) reqSql += ' OR '
            }
            console.log("c-reqSql = ",reqSql)
        }

        cnt++;
        if (cnt < Object.keys(filterData).length ){
            reqSql += " AND ";
        }
    }
    console.log("reqSql = ",reqSql);
    //Construct the query -- end


    try {
        console.log("2.Partial Order-Based Solution have received request. + tableName:",tableName);
        let data = await new Promise((resolve, reject) => {  //使用Promise进行同步操作

            const cPath = process.cwd() +'/Partial_Order/partial_order.py';
            let argv = [];
            argv.push(cPath);
            argv.push(tableName);
            argv.push(reqSql);
            // console.log("columnNameType.length == ",columnNameType.length);
            for (let i = 0; i < columnNameType.length; i++){
                argv.push(columnNameType[i]);
            }
            console.log("argv = ",argv);
            const ls = spawn('python',argv);
            let result = '';
            ls.stdout.on('data', (data) => {
                result += data;
            });

            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });
            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (result !== '') resolve(result);

            });

        });
        console.log("Partial Order 执行完毕，返回结果");
        console.log("data的类型" + typeof(data));
        console.log("Partial Order 产生的结果:",data);
        res.send({data});
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
});

module.exports = router;
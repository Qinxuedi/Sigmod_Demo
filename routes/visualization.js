/**
 * Created by luoyuyu on 2017/12/19.
 */
var express = require('express');
var router = express.Router();
var myFunction = require('../routes/my-function');
var pool = require('../mysql/dbConfig');
var tablePool = require('../mysql/dbTable');
const spawn = require('child_process').spawn;

router.get('/Machine_Learning',async function (req, res, next) {
    const { colSelection, keyWord, tableName } = req.query;
    console.log("colSelection = ",colSelection);
    console.log("keyWord = ",keyWord);
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

    if (colSelection === undefined){//没有进行column selection
        //get filed and data type here
        //code ...
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
        // console.log("columnNameType ==> ",columnNameType);
        if(keyWord === ''){//没有进行keyword search
            reqSql = 'SELECT * FROM '+"`"+tableName+"`";
            // console.log("reqSql ==> ",reqSql);
        }else {
            let searchWord = keyWord;
            // let searchWord = '%'+keyWord+'%';
            reqSql = 'SELECT * FROM '+"`"+tableName+"`"+' WHERE ';
            for (let i = 0; i < columnName.length; i++){
                reqSql += "`"+columnName[i]+"`" + ' LIKE ' + "'" + searchWord + "'";
                if (i != columnName.length - 1) reqSql += ' OR '
            }
            // console.log("reqSql ==> ",reqSql);
        }
    }else{//进行Column selection
        //get filed and datatype here
        //code ...
        let j = 0;
        for (let i = 0; i < columnName.length; i++){
            if (colSelection[j] === columnName[i]){
                colName.push(columnName[i]);
                colType.push(columnType[i]);
                j++;
            }
        }
        for (let i = 0; i < colName.length; i++){
            columnNameType.push(colName[i]);
        }
        for (let i = 0; i < colType.length; i++){
            columnNameType.push(colType[i]);
        }
        // console.log("columnNameType ==> ",columnNameType);
        if (keyWord === ''){//没有进行keyword search
            reqSql += 'SELECT ';
            for (let i = 0; i < colSelection.length; i++){
                reqSql += '`'+colSelection[i]+'`';
                if (i !== colSelection.length - 1) reqSql +=', ';
            }
            reqSql += ' FROM '+"`"+tableName+"`";
            // console.log("reqSql ==> ",reqSql);
        }
        else {
            // let searchWord = '%'+keyWord+'%';
            let searchWord = keyWord;
            reqSql += 'SELECT ';
            for (let i = 0; i < colSelection.length; i++){
                reqSql += "`"+colSelection[i]+"`";
                if (i !== colSelection.length - 1) reqSql +=', ';
            }
            reqSql += ' FROM '+"`"+tableName+"`"+' WHERE ';
            for (let i = 0; i < columnName.length; i++){
                reqSql += "`"+columnName[i]+"`" + ' LIKE ' + "'" + searchWord + "'";
                if (i != columnName.length - 1) reqSql += ' OR '
            }
            // console.log("reqSql ==> ",reqSql);
        }
    }

    try {
        console.log("Machine Learning Solution have received request. + tableName:",tableName);
        let data = await new Promise((resolve, reject) => {  //使用Promise进行同步操作

            const cPath = process.cwd() +'/Learn_to_Rank/learn_to_rank.py';
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
        console.log("Learning_to_Rank 执行完毕，返回结果");
        // console.log("Learning_to_Rank 产生的结果:",data);
        res.send({data});

    }
    catch(err){
        console.log(err);
        res.send(err);
    }
});

router.get('/Partial_Order',async function (req, res, next) {
    const tableName  = req.query.tableName;
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
    // console.log("columnName = ",columnName);
    // console.log("columnType = ",columnType);

    //TODO 构建查询语句
    //get filed and data type here
    //code ...
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
    // console.log("columnNameType ==> ",columnNameType);

    reqSql = 'SELECT * FROM '+"`"+tableName+"`";
    // console.log("reqSql ==> ",reqSql);


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
        res.send({err});
    }
});

module.exports = router;

//TODO for Keyword search to visualization
// router.get('/NL2Vis',async function(req, res, next){
//     let {query, info, tableName } = req.query;
//     console.log("info = ",info, "tableName = ", tableName, "query = ",query);
//     let columnName = [];
//     let columnType = [];
//     //接受用户输入的natural language query，
//     //console.log("info:"+info);
//     try {
//         await new Promise((resolve, reject) => {
//             pool.getConnection(function (err,connection) {
//                 if (err) reject(err);
//                 else {
//                     connection.query('DESCRIBE '+"`"+tableName+"`",function (err,result) {
//                         if (err) reject(err);
//                         else {
//                             //将查询之后的result存储起来
//                             for (let i = 0; i < result.length; i++){
//                                 columnName.push(result[i].Field);
//                                 columnType.push(result[i].Type);
//                             }
//                             //resolve结果
//                             resolve(result);
//                         }
//                         connection.release();
//                     })
//                 }
//             })
//
//         })
//     }catch (err){
//         console.log(err);
//     }
//     res.send([nlInterpretation(columnName,columnType,query)]); //function & return
// });
//
//
// function matchVisType(splitQuery, nlpObject) {
//     //
//     let visTypeDic = {
//         "bar":["bar"],"bars":["bar"], 'stacked':["bar"],'grouped':["bar"],'grouping':["bar"],
//         'category':["bar"],'histogram':["bar"],'column':["bar"],'columns':["bar"],
//         "line":["line"],'lines':["line"],'time':["line"],
//         'series':["line"],'trend':["line"],'trends':["line"],'relationship':["line","scatter"],'relation':["line","scatter"],
//         'correlate':["line","scatter"],'correlation':["line","scatter"],'correlations':["line","scatter"],'correlated':["line","scatter"],
//         'correlates':["line","scatter"],'related':["line","scatter"],'relates':["line","scatter"],
//         'positive':["line","scatter"],'negative':["line","scatter"],
//         'fluctuate':["line"],'fluctuates':["line"],'fluctuation':["line"],'wave':["line"],
//         "pie":["pie"],'part':["pie"],'whole':["pie"],'proportion':["pie"],
//         "scatter":["scatter"],'plot':["scatter"],'between':["scatter"],
//         'distribution':["scatter"],'distribute':["scatter"],'distributes':["scatter"],'distributing':["scatter"],'distributed':["scatter"],
//         'max':["bar","line"],'maximum':["bar","line"],'min':["bar","line"],'minimum':["bar","line"],
//     };
//     for (let i =0; i< splitQuery.length;i++){
//         if(visTypeDic[splitQuery[i]]){
//             let typeList = visTypeDic[splitQuery[i]];
//             for (let j in typeList){
//                 if(nlpObject.success.VisualizationType.indexOf(typeList[j]) < 0){
//                     nlpObject.success.VisualizationType.push(typeList[j]);
//                 }
//             }
//         }
//     }
//
//     if(nlpObject.success.VisualizationType.length == 0){
//         nlpObject.success.VisualizationType.push("bar", "line","pie","scatter");
//     }
//     return nlpObject;
// }
//
// function matchAttributes(splitQuery, columnName, nlpObject) {
//     for (let i = 0; i < splitQuery.length; i++){
//         for (let j = 0; j < columnName.length; j++){
//             if (columnName[j] == splitQuery[i]) nlpObject.success.Attributes.push(splitQuery[i]);
//         }
//     }
//
//     if (nlpObject.success.Attributes.length == 0) {
//         for (let i = 0; i < columnName.length; i++) {
//             nlpObject.success.Attributes.push(columnName[i]);
//         }
//     }
//     return nlpObject;
// }
//
// function matchAggregates(splitQuery, nlpObject) {
//     //
//     let aggrDic = {
//         "sum":["sum"],'summarize':["sum"],'sums':["sum"],'all':["sum","count"],
//         "avg":["avg"],'average':["avg"],'averages':["avg"],
//         "count":["count"],'counts':["count"],
//     };
//     for (let i =0; i< splitQuery.length;i++){
//         if(aggrDic[splitQuery[i]]){
//             let typeList = aggrDic[splitQuery[i]];
//             for (let j in typeList){
//                 if(nlpObject.success.Aggregates.indexOf(typeList[j]) < 0){
//                     nlpObject.success.Aggregates.push(typeList[j]);
//                 }
//             }
//         }
//     }
//
//     if(nlpObject.success.Aggregates.length == 0){
//         nlpObject.success.Aggregates.push("sum","avg","count");
//     }
//     return nlpObject;
// }
//
// function matchOtherFeatures(splitQuery, nlpObject) {
//
//     return nlpObject;
// }
//
// function nlInterpretation(columnName, columnType, query) {
//
//     var keywords_fixed = ['pie', 'line', 'bar', 'scatter'];
//     var stopwords = [];
//     //0. Init nlpObject;
//     let nlpObject = {
//         "failure":"Sorry, I am not sure what is your meaning, can you try asking that in a different way",
//         "success":{
//             "VisualizationType" : [], //bar/line/pie/scatter/not fixed
//             "Attributes" :[], //'column1','column2','column3','not fixed'
//             "Aggregates" :[], //'Sum()', 'Count()', 'Avg()', 'None()'
//             "OtherFeatures" :[] //'Correlate', 'Correlation', 'Related'
//         }
//     };
//
//     //现在获取了dataset 的column name, column value, 以及用户的natural language query.
//     //1. 将column name/type 全部用小写存储，用户输入的query也全部转成小写.
//     // do
//     for (let i = 0; i < columnName.length; i++){
//         columnName[i] = columnName[i].toLowerCase();
//         columnType[i] = columnType[i].toLowerCase()
//     }
//     console.log("column Name = ", columnName);
//     console.log("column Type = ", columnType);
//     query = query.toLowerCase(); //全部用小写存储
//     let splitQuery = query.split(' ');
//     console.log("query after splitting: ", splitQuery);
//
//     // We care about noun
//     // Parser
//
//     //2. match visualization type from query.
//     nlpObject = matchVisType(splitQuery, nlpObject);
//
//     //3. match attributes from query.
//     nlpObject = matchAttributes(splitQuery, columnName, nlpObject);
//
//     //4. match aggregate function.
//     nlpObject = matchAggregates(splitQuery, nlpObject);
//
//     //5. match other features
//     nlpObject = matchOtherFeatures(splitQuery, nlpObject);
//
//     //6. add column name into nlpObject
//     nlpObject['columnName'] = columnName;
//
//     return nlpObject;
// }
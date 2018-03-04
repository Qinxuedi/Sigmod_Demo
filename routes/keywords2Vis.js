/**
 * Created by luoyuyu on 2018/3/4.
 */
var express = require('express');
var router = express.Router();
var myFunction = require('../routes/my-function');
var pool = require('../mysql/dbConfig');
var tablePool = require('../mysql/dbTable');

router.get('/',async function(req, res, next){
    let {query, info, tableName } = req.query;
    console.log("info = ",info, "tableName = ", tableName, "query = ",query);
    let columnName = [];
    let columnType = [];
    //接受用户输入的natural language query，
    //console.log("info:"+info);
    try {
        await new Promise((resolve, reject) => {
            pool.getConnection(function (err,connection) {
                if (err) reject(err);
                else {
                    connection.query('DESCRIBE '+"`"+tableName+"`",function (err,result) {
                        if (err) reject(err);
                        else {
                            //将查询之后的result存储起来
                            for (let i = 0; i < result.length; i++){
                                columnName.push(result[i].Field);
                                columnType.push(result[i].Type);
                            }
                            //resolve结果
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
    res.send([nlInterpretation(columnName,columnType,query)]); //function & return
});


function matchVisType(splitQuery, nlpObject) {
    //
    let visTypeDic = {
        "bar":["bar"],"bars":["bar"], 'stacked':["bar"],'grouped':["bar"],'grouping':["bar"],
        'category':["bar"],'histogram':["bar"],'column':["bar"],'columns':["bar"],
        "line":["line"],'lines':["line"],'time':["line"],
        'series':["line"],'trend':["line"],'trends':["line"],'relationship':["line","scatter"],'relation':["line","scatter"],
        'correlate':["line","scatter"],'correlation':["line","scatter"],'correlations':["line","scatter"],'correlated':["line","scatter"],
        'correlates':["line","scatter"],'related':["line","scatter"],'relates':["line","scatter"],
        'positive':["line","scatter"],'negative':["line","scatter"],
        'fluctuate':["line"],'fluctuates':["line"],'fluctuation':["line"],'wave':["line"],
        "pie":["pie"],'part':["pie"],'whole':["pie"],'proportion':["pie"],
        "scatter":["scatter"],'plot':["scatter"],'between':["scatter"],
        'distribution':["scatter"],'distribute':["scatter"],'distributes':["scatter"],'distributing':["scatter"],'distributed':["scatter"],
        'max':["bar","line"],'maximum':["bar","line"],'min':["bar","line"],'minimum':["bar","line"],
    };
    for (let i =0; i< splitQuery.length;i++){
        if(visTypeDic[splitQuery[i]]){
            let typeList = visTypeDic[splitQuery[i]];
            for (let j in typeList){
                if(nlpObject.success.VisualizationType.indexOf(typeList[j]) < 0){
                    nlpObject.success.VisualizationType.push(typeList[j]);
                }
            }
        }
    }

    if(nlpObject.success.VisualizationType.length == 0){
        nlpObject.success.VisualizationType.push("bar", "line","pie","scatter");
    }
    return nlpObject;
}

function matchAttributes(splitQuery, columnName, nlpObject) {
    for (let i = 0; i < splitQuery.length; i++){
        for (let j = 0; j < columnName.length; j++){
            if (columnName[j] == splitQuery[i]) nlpObject.success.Attributes.push(splitQuery[i]);
        }
    }

    if (nlpObject.success.Attributes.length == 0) {
        for (let i = 0; i < columnName.length; i++) {
            nlpObject.success.Attributes.push(columnName[i]);
        }
    }
    return nlpObject;
}

function matchAggregates(splitQuery, nlpObject) {
    //
    let aggrDic = {
        "sum":["sum"],'summarize':["sum"],'sums':["sum"],'all':["sum","count"],
        "avg":["avg"],'average':["avg"],'averages':["avg"],
        "count":["count"],'counts':["count"],
    };
    for (let i =0; i< splitQuery.length;i++){
        if(aggrDic[splitQuery[i]]){
            let typeList = aggrDic[splitQuery[i]];
            for (let j in typeList){
                if(nlpObject.success.Aggregates.indexOf(typeList[j]) < 0){
                    nlpObject.success.Aggregates.push(typeList[j]);
                }
            }
        }
    }

    if(nlpObject.success.Aggregates.length == 0){
        nlpObject.success.Aggregates.push("sum","avg","count");
    }
    return nlpObject;
}

function matchOtherFeatures(splitQuery, nlpObject) {

    return nlpObject;
}

function nlInterpretation(columnName, columnType, query) {

    var keywords_fixed = ['pie', 'line', 'bar', 'scatter'];
    var stopwords = [];
    //0. Init nlpObject;
    let nlpObject = {
        "failure":"Sorry, I am not sure what is your meaning, can you try asking that in a different way",
        "success":{
            "VisualizationType" : [], //bar/line/pie/scatter/not fixed
            "Attributes" :[], //'column1','column2','column3','not fixed'
            "Aggregates" :[], //'Sum()', 'Count()', 'Avg()', 'None()'
            "OtherFeatures" :[] //'Correlate', 'Correlation', 'Related'
        }
    };

    //现在获取了dataset 的column name, column value, 以及用户的natural language query.
    //1. 将column name/type 全部用小写存储，用户输入的query也全部转成小写.
    // do
    for (let i = 0; i < columnName.length; i++){
        columnName[i] = columnName[i].toLowerCase();
        columnType[i] = columnType[i].toLowerCase()
    }
    console.log("column Name = ", columnName);
    console.log("column Type = ", columnType);
    query = query.toLowerCase(); //全部用小写存储
    let splitQuery = query.split(' ');
    console.log("query after splitting: ", splitQuery);

    // We care about noun
    // Parser

    //2. match visualization type from query.
    nlpObject = matchVisType(splitQuery, nlpObject);

    //3. match attributes from query.
    nlpObject = matchAttributes(splitQuery, columnName, nlpObject);

    //4. match aggregate function.
    nlpObject = matchAggregates(splitQuery, nlpObject);

    //5. match other features
    nlpObject = matchOtherFeatures(splitQuery, nlpObject);

    //6. add column name into nlpObject
    nlpObject['columnName'] = columnName;

    return nlpObject;
}

module.exports = router;
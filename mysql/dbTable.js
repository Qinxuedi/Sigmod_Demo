/**
 * Created by luoyuyu on 2017/8/17.
 */
var mysql = require('mysql');
var tablePool = mysql.createPool({
    host :'localhost',
    user :'root',
    database:'dataVisDB',
    password:'Db10204!!',
    dateStrings: 'date'  //避免node-mysql 将mysql的date类型转成js-objects.date();
});
module.exports=tablePool; //这样子在模块外，connection()函数也能被访问到。
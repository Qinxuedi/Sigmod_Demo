/**
 * Created by luoyuyu on 2017/12/6.
 */
var express = require('express');
var router = express.Router();
const spawn = require('child_process').spawn;
/* GET home page. */
router.get('/', async function(req, res, next) {
    const {tableName , describe, x_name, y_name, chart} = req.query;
    let filter_var = '';
    let filter_value = '';
    console.log("tableName = "+tableName," describe = ",describe," x_name = ",x_name, "y_name = ",y_name,"chart = ",chart);
    try {
        let data = await new Promise((resolve, reject) => {  //使用Promise进行同步操作

            const cPath = process.cwd() +'/FacetedNavigation/FacetedNavigation.py';
            let argv = [];
            argv.push(cPath);
            argv.push(tableName);
            argv.push(describe);
            argv.push(x_name);
            argv.push(y_name);
            argv.push(chart);

            console.log("argv = ",argv);
            const ls = spawn('python',argv);
            let result = '';
            ls.stdout.on('data', (data) => {
                result += data;
            });

            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
                resolve({"err": `${data}`});
            });
            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
                if (result !== '') resolve(result);

            });

        });
        console.log("Faceted Navigation 执行完毕，返回结果");
        console.log("data的类型" + typeof(data));
        console.log("Faceted Navigation 产生的结果:",data);
        res.send([data]);
    }
    catch(err){
        console.log(err);
        res.send([err]);
    }
});

module.exports = router;

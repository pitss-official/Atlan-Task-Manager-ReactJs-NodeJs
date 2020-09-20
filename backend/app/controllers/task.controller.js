const db = require('../knex')
const fs = require('fs')
const path = require('path')
const stream = require('stream')
const toCSVTransform = (fields) => new stream.Transform({
    objectMode: true,
    transform: (row, encoding, callback) => {
        let rowAsArr = [];
        for(let i = 0; i < fields.length; i++) {
            rowAsArr.push(row[fields[i]]);
        }
        callback(null, `${rowAsArr.join(',')}\n`);
    }
});
const LineByLineReader = require('line-by-line')
const linesInFile = require('count-lines-in-file')
var tasks = {}
exports.index = async (req,res)=>{
    await db('tasks').select().orderBy('id','desc').then(data=>res.send(data));
}
exports.create = async (req,res,next)=>{
    if(!req.file) {
        res.status(400).send("invalid request");
        return;
    }
    await db('tasks').insert({
        name:req.body.name,
        file_name:req.saveFileName+'.csv',
        user_id:1,
        tableName:req.saveFileName,
        status:0
    }).then(data=>res.send(data))
}
exports.pause = (req,res)=>{
    let task = req.params.id;
    if(tasks[req.params.id]){
        tasks[req.params.id].state = 1;
        tasks[req.params.id]['lineReader'].pause()
        tasks[req.params.id]['lineReader'].emit('pause')
    }else{
        res.status(400).send('task is not executing');
    }
    res.send("pause");
}
//state 0 = ready
//state 1 = paused
//state 2 = completed
//state 3 = stopped
//state 4 = exec
exports.resume = async (req,res)=>{
    let task = req.params.id;
    task = await db('tasks').select().where('id',task).then(data=> {
        if (data.length===0){
            res.status(400,"Invalid request");
            return;
        }else {
            if(!tasks[req.params.id]){
                let filePath = path.join(__dirname,'..','..','uploads','tasks',data[0].file_name);
                tasks[req.params.id] = {
                    id:req.params.id,
                    tableName:data[0].tableName,
                    state : 4,
                    currentLine: 0,
                    lineReader : new LineByLineReader(filePath),
                }
                if(!tasks[req.params.id].totalLines)linesInFile(filePath, (error, numberOfLines) => {
                    tasks[req.params.id].totalLines = numberOfLines;
                });
                tasks[req.params.id]['lineReader'].on('line',line=>{
                    console.log(tasks[req.params.id].currentLine)
                    tasks[req.params.id]['lineReader'].pause()
                    tasks[req.params.id]['lineReader'].emit('pause')
                    if(tasks[req.params.id].currentLine===0){
                        tasks[req.params.id].header = line.replace(/ /g,'_').split(',');
                        db.schema.createTableIfNotExists(tasks[req.params.id].tableName,table=>{
                            table.increments('id');
                            tasks[req.params.id].header.forEach(value => {
                                table.string(value).nullable();
                            })
                        }).then(data=>{
                            if(tasks[req.params.id].state ===4){
                            tasks[req.params.id]['lineReader'].resume();
                            tasks[req.params.id]['lineReader'].emit('resume')}
                        }).catch(console.log)
                    }
                    else{
                        let values = line.split(',');
                        db(tasks[req.params.id].tableName).insert(Object.fromEntries(tasks[req.params.id].header.map((_, i)=> [tasks[req.params.id].header[i], values[i]])))
                            .then(data=>{
                                if(tasks[req.params.id].state ===4){
                                    tasks[req.params.id]['lineReader'].resume();
                                    tasks[req.params.id]['lineReader'].emit('resume')
                                }
                            })
                    }

                })
                tasks[req.params.id]['lineReader'].on('pause',()=>{
                    console.log('pause')
                })
                tasks[req.params.id]['lineReader'].on('finish',()=>{
                    console.log('finish')
                })
                tasks[req.params.id]['lineReader'].on('resume',()=>{
                    tasks[req.params.id].currentLine+=1;
                })
                res.send("no such task, creating one")
            }
            else{
                tasks[req.params.id].state = 4;
                tasks[req.params.id]['lineReader'].resume();
            }

        }
    })
    // res.send(200,val++);
}
// exports.rollback = (req,res)=> {
//     res.send("truncate");
// }
exports.delete = async (req,res)=> {
    let task = req.params.id;
    if(!task)res.status(400,"Invalid Request");
    task = await db('tasks').select().where('id',task).then(data=> {
        if (data.length===0){
            res.status(400,"Invalid request");
            return;
        }
        db('tasks').where('id',req.params.id).del().then(console.log);
        let filePath = path.join(__dirname,'..','..','uploads','tasks',data[0].file_name);
        fs.unlink(filePath,res=>{
            console.log(res)
            db.schema.dropTableIfExists(data[0].tableName).then(console.log);
        })
    });
    res.send("delete");
}
exports.header = (req,res)=>{
    res.send('table structure');
}
exports.status = async (req,res)=>{
    let task = req.params.id;
    if(tasks[task])
    res.json({state:tasks[task].state,currentLine:tasks[task].currentLine,totalLines:tasks[task].totalLines})
    else{
        let obj ={}
        await db('tasks').select().where('id',task).then(data=> {

            db.schema.hasTable(data[0].tableName).then(st=>{
                if(st){
                    let filePath = path.join(__dirname,'..','..','uploads','tasks',data[0].file_name);
                    db(data[0].tableName).count().then(count=>{
                                 obj={state:45,currentLine:count[0]['count(*)']}})
                        linesInFile(filePath, (error, numberOfLines) => {
                            obj['totalLines']=numberOfLines;
                        })
                    res.json(obj);
                }else{
                    res.status(400).send("No such task");
                }
            })
        })

    }
}
var downloadtask = {}
exports.export = async (req,res)=>{
    let task = req.params.id;
    await db('tasks').select().where('id',task).then(data=> {
        let filePathd = path.join(__dirname,'..','..','downloads',data[0].file_name);
        let filePathu = path.join(__dirname,'..','..','uploads','tasks',data[0].file_name);
        if(!downloadtask[task]){
            downloadtask[task] = {
                state:1,
                tableName:data[0].tableName,
                filename:data[0].file_name,
                lineReader: new LineByLineReader(filePathu),
                writeStream: fs.createWriteStream(filePathd),
                stream:db.select('*').from(data[0].tableName).stream(),
            }
            downloadtask[task].lineReader.resume();
            downloadtask[task].lineReader.on('line',line=>{
                downloadtask[task].writeStream.write(line+'\n');
            })
            downloadtask[task].lineReader.on('finish',()=>{
                downloadtask[task].writeStream.close();
                downloadtask[task].state=1;
            })
        }
    })
}
exports.downloadStatus = (req,res)=>{
    let id = req.params.id;
    if(downloadtask[id])
        res.json({state:downloadtask[id].state,file:downloadtask[id].filename})
    else res.status(
        400
    ).send("no such task")
}
exports.downloadPause = (req,res) =>{
    let id = req.params.id;
    if (downloadtask[id]){
        downloadtask[id].lineReader.pause();
    }
}
exports.stop = (req,res)=>{
    let task = req.params.id;
    if(tasks[req.params.id]){
        tasks[req.params.id].state = 3;
        tasks[req.params.id]['lineReader'].pause()
        tasks[req.params.id]['lineReader'].emit('pause')
    }else{
        res.status(400).send('task is not executing');
    }
    res.send("stop");
}
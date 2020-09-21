# Atlan Task Scheduler
###### Author : Pawan Kumar

To Get Started, Download this repo

```shell script
docker-compose -f docker-compose.yml up --build
```
once the message is displayed that server started at http://localhost:8000 (backend node server)
```html
http://localhost (frontend ngnix server)
```
test using sample csv files in the repo. "Recsmall.csv" and "records.csv"

Various API available:

| Route      | Method | Underlying Handler    | Response |   |
|------------|--------|-----------------------|----------|---|
| /task      | GET    | index@taskcontroller  | Array    |   |
| /task      | POST   | create@taskcontroller | Object   |   |
| /task/{id} | PUT    | resume@taskcontroller | Object   |   |
| /task/{id} | DELETE    | delete@taskcontroller | Object   |   |
| /task/{id} | GET    | export@taskcontroller | Object   |   |
| /task/{id} | POST    | pause@taskcontroller | Object   |   |
| /task/{id}/status | GET    | status@taskcontroller | Object   |   |
| /task/{id}/download/status | GET    | downloadStatus@taskcontroller | Object   |   |
| /task/{id}/download/pause | GET    | downloadPause@taskcontroller | Object   |   |

Workflow for Creating and resuming tasks
* task is added into the tasks table and file is stored into the uploads folder
* when task is started, the file is parsed line by line and inserted into database
* by creating a new table with unique name
* then a stream is constructed which can be controlled by rest api commands
* stream emits various events which determine the progress of the task


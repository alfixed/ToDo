'use strict';

const Hapi = require('hapi'); 
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/hapidb', { useMongoClient: true })
//     .then(() => console.log('MongoDB connected...'))
//     .catch(err => console.error(err));

// // Create Task Model
// const Task = mongoose.model('Task', {text:String});
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hapidb');

//Create task model
const Task = mongoose.model('Task', {text:String});

//Init Server and add co nnection
const server = new Hapi.Server({
    port: 8001,
    host: 'localhost'
}); 

// //Home Route
// server.route({
//     method:'GET',
//     path:'/',
//     handler:  (request, h) => {
//           //reply('Hello World!');
//           return '<h1>hello world</h1>';
//           //return h.view('index');
//     }
// });

//Dynamic route
server.route({
    method:'GET',
    path:'/users/{name}',
    handler:  (request, h) => {
          //h('Hello World!');
          return '<h1>Hello, ' + request.params.name  + '</h1>';
    }
});

//Static route
const start = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/about',
        handler: function (request, h) {

            return h.file('./public/about.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/image',
        handler: function (request, h) {

            return h.file('./public/hapi.png');
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();

//Vision template
const Vision = require('vision');
const Handlebars = require('handlebars');

const rootHandler = (request, h) => {

    return h.view('index', { 
        name: 'John Doe',
        title: 'examples/handlebars/templates/basic | Hapi ' + request.server.version,
        message: 'Hello Handlebars!'
    });
};

const provision = async () => {

    await server.register(Vision);

    server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname + '/views',
        //path: 'examples/handlebars/templates/basic'
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });

    await server.start();
    console.log('Server running at:', server.info.uri);
};

provision();

//Task route
const taskHandler = (request, h) => {
    let t = Task.find((err, tasks) => {
        console.log(tasks);
        
        //return tasks;
        })
    };
    // return h.view();
    // return h.view('tasks',{
    //     tasks: [
    //         {text:'Task One'},
    //         {text:'Task Two'},
    //         {text:'Task Three'}
    //     ]
    // });
    return {};
;
const task = async () => {
    server.route({ method: 'GET', path: '/tasks', handler: taskHandler })};

task();


// server.route({
//     method:'GET',
//     path:'/tasks',
//     handler:  (request, h) => {
//           return h.view('tasks',{
//               tasks: [
//                   {text:'Task One'},
//                   {text:'Task Two'},
//                   {text:'Task Three'}
//               ]
//           });
//     }
// });

//Start server
//server.start();
await server.start((err)=>{
    if(err){
        throw err; 
    }

    console.log(`Server started at: ${server.info.uri}`)
}); 
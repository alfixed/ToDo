'use strict';

const Hapi = require('hapi');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hapidb');
const Task = mongoose.model('Task', {text:String});

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello, world!';
    }
});

const taskHandler = async (request, h) => {
    let t = await Task.find((err, tasks) => {
        // console.log(tasks);
    });
    console.log(t);
    //return t;
    return h.view('tasks',{
        tasks: t
    });
    // return h.view('tasks');
};

server.route({
    method: 'GET',
    path: '/tasks',
    handler: taskHandler
})

const init = async () => {
    console.log(`Server running at: ${server.info.uri}`);
    await server.start();
    await server.register(require('vision'));

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views'
    });
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

import "reflect-metadata";
import {getRepository} from "typeorm";
import {Event} from "../entity/Event";
import{User} from "../entity/User";
const koa = require("koa");
const koaBody = require('koa-body');

var authenticate_post = async(ctx, next) => {
    let userRepository = getRepository(User);
    let body = ctx.request.body;
    let user = await userRepository
        .createQueryBuilder("user")
        .where("user.username = :name", {name : body.name})
        .addSelect("user.password")
        .getOne();
    if(user == undefined || user.password != body.password) {
        ctx.status = 403;
        ctx.body = '{"status":"Invalid credential"}';
    } else {
        user['token'] = "<base64 encoded token>";
        ctx.body = JSON.stringify(user);
    }
    ctx.type = 'application/json';
}

var items_post = async(ctx, next) => {
let eventRepository = getRepository(Event);
let Allevents = await eventRepository.find();
ctx.body = JSON.stringify(Allevents);
ctx.type = 'application/json';
}

var items_get = async(ctx, next) => {
let eventRepository = getRepository(Event);
let body = ctx.request.body;
for(let event of body) {
    if(event.done == undefined) {
        event.done = false;
    }
    await eventRepository.insert(event);
}
ctx.body = JSON.stringify(body);
ctx.type = 'application/json';
}

var items_id_get = async(ctx, next) => {
let eventRepository = getRepository(Event);
let event = await eventRepository.findOne(ctx.params.id);
if(event == undefined) {
    ctx.status = 404;
    ctx.body = '{"status":"Item not found"}';
} else {
    ctx.body = JSON.stringify(event);
}
ctx.type = 'application/json';
}

var items_id_put = async(ctx, next) => {
let eventRepository = getRepository(Event);
let event = ctx.request.body;
if(await eventRepository.findOne(ctx.params.id) == undefined) {
    ctx.status = 404;
    ctx.body = '{"status":"Item not found"}';
} else if(event.title == undefined || event.done == undefined || typeof(event.title) != "string" || typeof(event.done) != "boolean") {
    ctx.status = 400;
    ctx.body = '{"status":"Invalid request"}';
} else  {
    ctx.body = JSON.stringify(await eventRepository.save(ctx.params.id, event));
}
ctx.type = 'application/json';
}

var items_id_delete = async(ctx, next) => {
let eventRepository = getRepository(Event);
let event = eventRepository.findOne(ctx.params.id);
if(event == undefined) {
    ctx.status = 404;
    ctx.body = '{"status":"Invalid request"}';
} else {
    await eventRepository.delete(ctx.params.id);
    ctx.status = 204;
}
ctx.type = 'application/json';
}


module.exports = {
    'POST /todolist/authenticate': authenticate_post,
    'POST /todolist/items': items_post,
    'GET /todolist/items': items_get,
    'GET /todolist/items/id': items_id_get,
    'DELETE /todolist/items/id': items_id_delete,
    'PUT /todolist/items/id': items_id_put,
};
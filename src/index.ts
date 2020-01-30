import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { runInNewContext } from "vm";
import e = require("express");


createConnection().then(async connection => {
    const koa = require("koa");
    const Router = require('koa-router');
    const koaBody = require('koa-body');
    const router = new Router();
    const app = new koa();
    app.use(koaBody());
    router.get('/users', async(ctx, next) => {
        let user  = new User();
        let userRepository = connection.getRepository(User);
        let Allusers = await userRepository.find();
        ctx.body = JSON.stringify(Allusers);
        ctx.type = 'application/json';
    });

    router.post('/users', async(ctx, next) => {
        for(let user of ctx.request.body) {
            if(user.isAdmin === undefined) {
                user.isAdmin = false;
            }
            if(user.displayName == undefined) {
                user.displayName  = user.username;
            }
            let userRepository = connection.getRepository(User);
            await userRepository.insert(user);
        }
        ctx.body = JSON.stringify(ctx.request.body);
        ctx.type = 'application/json';
    });

    router.delete('/users/:uid', async(ctx, next) => {
        let userRepository = connection.getRepository(User);
        let user = await userRepository.findOne(ctx.params.uid);
        if(user == undefined) {
            ctx.status = 404;
            ctx.body = '{"status":"Item not found"}';
            ctx.type = 'application/json';
        } else {
                await userRepository.remove(user);
                ctx.status = 204;
        }
    })

    router.patch('/users/:uid', async(ctx, next) =>{
        let userRepository = connection.getRepository(User);
        let user = await userRepository.findOne(ctx.params.uid);
        let body = ctx.request.body;
        if(user == undefined) {
            ctx.status = 404;
            ctx.body = '{"status": "item not found"}';
        } else {
            await userRepository.update(user, body);
            user = await userRepository.findOne(ctx.params.uid);
            ctx.body = JSON.stringify(user);
        }
        ctx.type = "application/json";
    })

    app
    .use(router.routes())
    .use(router.allowedMethods());

    app.use(async (ctx : any) => {
        ctx.status = 404;
        ctx.body = "ERR";
      });
    
      app.listen(3000);
    
  
}).catch(error => console.log(error));
 
import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";


createConnection().then(async connection => {
    const koa = require("koa");
    const Router = require('koa-router');
    const koaBody = require('koa-body');
    const router = new Router();
    const app = new koa();
    app.use(koaBody());
    router.post('/todolist/authenticate', async (ctx, next) => {
        var
            name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        console.log(`signin with name: ${name}, password: ${password}`);
        if (name === 'koa' && password === '12345') {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
            <p><a href="/">Try again</a></p>`;
        }
    });
    router.get('/users', async(ctx, next) => {
    
    });
    router.get('/users', async(ctx, next) => {
    
    });
    router.get('/users', async(ctx, next) => {
    
    });
    router.get('/users', async(ctx, next) => {
    
    });
    router.get('/users', async(ctx, next) => {
    
    });
    router.get('/users', async(ctx, next) => {
    
    });
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
            let userRepsoitory = connection.getRepository(User);
            userRepsoitory.insert(user);
        }
        ctx.body = JSON.stringify(ctx.request.body);
        ctx.type = 'application/json';
    });
}).catch(error => console.log(error));

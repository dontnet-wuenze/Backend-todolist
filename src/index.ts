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

    app
    .use(router.routes())
    .use(router.allowedMethods());

    app.use(async (ctx : any) => {
        ctx.status = 404;
        ctx.body = "ERR";
      });
    
      app.listen(3000);
    
  
}).catch(error => console.log(error));

import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import{Event}from "./entity/Event";
import e = require("express");

const controller  = require( './controller');
//import  controller  = require( './controller');

createConnection().then(async connection => {
    const koa = require("koa");
    const Router = require('koa-router');
    const koaBody = require('koa-body');
    const router = new Router();
    const app = new koa();
    app.use(koaBody());

    app
    .use(controller())
    .use(router.allowedMethods());

    app.use(async (ctx : any) => {
        ctx.status = 404;
        ctx.body = "ERR";
      });
    
      app.listen(3000);
      console.log('app started at port 3000...'); 
  
}).catch(error => console.log(error));
 
import http from "node:http";
import {readFile,stat} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.dirname(fileURLToPath(import.meta.url));
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".webmanifest":"application/manifest+json; charset=utf-8",".svg":"image/svg+xml; charset=utf-8"};
const server=http.createServer(async(req,res)=>{try{let u=new URL(req.url,"http://localhost").pathname;let f=path.join(root,u==="/"?"index.html":u.slice(1));try{if((await stat(f)).isDirectory())f=path.join(f,"index.html")}catch{f=path.join(root,"index.html")}const data=await readFile(f);res.setHeader("Content-Type",types[path.extname(f)]||"application/octet-stream");res.setHeader("Cache-Control",path.basename(f)==="sw.js"?"no-cache":"public, max-age=3600");res.end(data)}catch(e){res.statusCode=500;res.end("Erreur")}});server.listen(process.env.PORT||3000,"0.0.0.0");
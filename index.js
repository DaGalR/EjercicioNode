const http = require("http");
const fs = require("fs");
const axios = require("axios");
const url = require("url");
const { table } = require("console");

const prov_recurso = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const clie_recurso = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";


let readFile = (callback) => {
    fs.readFile("index.html", (err, data) => {
        let pageContent = data.toString();
        pageContent = pageContent.replace("{{replace}}", "<h1>Hola mundo desde node.</h1>");
        callback(pageContent);
     });
    
};



http.createServer((req, res) => {
    let urlActual = url.parse(req.url).pathname;
    if(urlActual === "/api/proveedores"){
        axios.get(prov_recurso)
        .then((response) => {
            let proveedores = response.data;
            fs.readFile("index.html", (err, data) => {
               if(err){
                res.writeHead(404, {"Content-Type": "text/html"});
                return res.end("Error 404");
               }
               else{
                res.writeHead(200, {"Content-Type": "text/html"});
                let title = "<h1> Listado de proveedores</h1>\ ";
                res.write(title);
                let table = 
                        "<table class='table table-striped'>\
                        <thead>\
                        <tr>\
                            <th>ID</th>\
                            <th>Nombre</th>\
                            <th>Contacto</th>\
                        </tr>\
                        </thead>\
                        <tbody>";
                res.write(table);
                
                for(let i = 0; i < proveedores.length;i++){
                    let prov = proveedores[i];
                    res.write(`<tr>\
                    <td>${prov.idproveedor}</td><td>${prov.nombrecompania}</td><td>${prov.nombrecontacto}</td>`);
                }
                
                res.write("</tbody>");
                res.end(data.toString());
               }
             });
        })
        .catch(error => console.log(error));
    }
    else if(urlActual === "/api/clientes"){
        axios.get(clie_recurso)
        .then((response) => {
            let clientes = response.data;
            fs.readFile("index.html", (err, data) => {
               if(err){
                res.writeHead(404, {"Content-Type": "text/html"});
                return res.end("Error 404");
               }
               else{
                res.writeHead(200, {"Content-Type": "text/html"});
                let title = "<h1> Listado de clientes</h1>\ ";
                res.write(title);
                let table = 
                        "\<table class='table table-striped' id='content'>\
                        <thead>\
                        <tr>\
                            <th>ID</th>\
                            <th>Nombre</th>\
                            <th>Contacto</th>\
                        </tr>\
                        </thead>\
                        <tbody>";
                res.write(table);
                
                for(let i = 0; i < clientes.length;i++){
                    let cli = clientes[i];
                    res.write(`<tr>\
                    <td>${cli.idCliente}</td><td>${cli.NombreCompania}</td><td>${cli.NombreContacto}</td>`);
                }
                res.write("</tbody>");
                res.end(data.toString());
               }
             });
        })
        .catch(error => console.log(error));
    }
    else{
        readFile((data) => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data.toString());
        });
    }

})
.listen(8081);


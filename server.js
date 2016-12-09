'use strict';
		var files = [];
        //Express
        var express = require('express');
		var port = 4001
		var contador = 1;
		var mostrando = 0;
        //Acces File System
        var fs = require('fs');
        var path = require('path'); 
        //Compress response body
        var compression = require('compression');
		var UserController = require('./UserController');
        //Trabaja el body
        //var iconv = require('iconv-lite');
        //Subida
        //var multiparty = require('connect-multiparty');
        //Reportes
        //var jsreport = require('jsreport');
        //Comunicación
        //var soap = require('soap');
        //var http = require('http');
        //Cross-origin resource sharing
		var multiparty = require('connect-multiparty'),
		multipartyMiddleware = multiparty();
        var cors = require('cors');
		


        var corsOptions = {
        origin: '*' 
        };

        //Init app and add middlewares
        var app = express();
		var bodyParser = require('body-parser');
		app.use(bodyParser.json({limit: '50mb'}));
		app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        app.use(compression());
        app.use(cors(corsOptions));

                
        app.use('/Fiesta', express.static('public'));
		
		app.use('/imagenes', express.static('imagenes'));
		
		// Subida de archivo
		app.post('/upload/url', multipartyMiddleware,  function(req, res) {
			// We are able to access req.files.file thanks to 
			// the multiparty middleware
			console.log(req.headers.orientation);
			var file = req.files.file;
			console.log(file.name);
			console.log(file.type);
			console.log(file.path);
			
			var newPath = "./imagenes/"+contador+".jpg";  //+file.name;
			
			files.push({"filename":contador+".jpg","orientation":req.headers.orientation});
			
			fs = require('fs');
			fs.readFile(file.path, function (err, data) {
				fs.writeFile(newPath, data, function (err) {
					 if(err === null){
					  contador = contador + 1
					  res.json({"status":true});
					  }else{
					  res.json({"status":false});
					  }
				});
			});
			
			
			fs.unlinkSync(file.path);
			



		});

		
		
		app.get('/pantalla', function (req, res) {
			console.log("-> Pantalla");
			console.log("-> mostrando = " +mostrando);
			mostrando = mostrando + 1;
			if(mostrando === contador || mostrando > contador ){
			   mostrando = 1;
			}
			var filename = mostrando + ".jpg"
			for(var k in files){
				if(files[k].filename === filename){
					var orientation = files[k].orientation;
					break; 
				}
				
			}
			
			
			res.send(
			'<html><head> </head> <body style="text-align: center;background-color: cornflowerblue;"> </body><script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image.js"></script> <script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image-orientation.js"></script> <script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image-meta.js"></script> <script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image-exif.js"></script> <script src="https://blueimp.github.io/JavaScript-Load-Image/js/load-image-exif-map.js"></script> <script>setInterval(function () {location.reload(); }, 3000); var imageUrl = "./imagenes/'+filename+'";loadImage(imageUrl,function (img) {if(img.type === "error") {console.log("Error loading image " + imageUrl);} else {document.body.appendChild(img);}},{maxWidth: 1300, maxHeight:750, meta: true, canvas: true, orientation: '+orientation+'});</script> </html>'
			
			);


	
			
        });

        //Comentar en caso de servidor https
        app.listen(port, function () {
        console.log('started on port ' + port);
        });
        
        

const fs   = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 8080;

const handleNotFound = (res) => {

    fs.readFile(
        path.join(__dirname, 'public', '404.html'),
        (err, content) => {

            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.end(content, 'utf8');

        }
    )

};

const readFile = (req, res) => {

    const fileName  = req.url === "/" ? 'index.html' : `${req.url}.html`;

    const filePath  = path.join(__dirname, 'public', fileName);

    const extension = path.extname(filePath);

    let contentType = 'text/html';

    switch(extension) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(
        filePath,
        (error, content) => {

            if (error) {

                if (error.code === 'ENOENT') {

                    handleNotFound(res);

                } else {

                    res.writeHead(500);

                    res.end(`Server Error: ${error.code}`);

                }

                return;

            }

            res.writeHead(200, { 'Content-Type': contentType });
        
            res.end(content, 'utf8');

        }
    );

};

const server = http.createServer((req, res) => {

    readFile(req, res);

});

server.listen(PORT, () => console.log('Server Running...'));
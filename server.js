const express = require('express');
const path = require('path');

const app = express();

// Protocolo http
const server = require('http').createServer(app);

// Protocolo websocket
const io = require('socket.io')(server);

// Definindo onde acessa os arquivos publicos
app.use(express.static(path.join(__dirname, 'public')));

// Configurando para o node ler html nas views
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Render index.html
app.use('/', (req, res) => {
    res.render('index.html');
});

// Array para armazenar mensagens temporário
let messages = [];

// Conexão socket.id
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    // Mostrando todas as mensagens anteriores no array
    socket.emit('previousMessages', messages);

    // Recebendo a mensagem do form
    socket.on('sendMessage', data => {
        // console.log(data);
        messages.push(data);

        // Mandando as informações para todos os navegadores
        socket.broadcast.emit('receiveMessage', data);
    });
});

// Porta
server.listen(3000);



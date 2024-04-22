import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { pipeline } from '@xenova/transformers';
import { readFileSync } from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const data = readFileSync('./data/data_jis.txt').toString();
const welcome = { answer: "Hey, I'm AdmitWise a chatbot. I've some knowledge on educational department. You can consult with me on educational perspective and based on my knowledge I'll try to assist you.", score: 0.9999999999999999 };

pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad').then(bot => {
    new Server(server, {
        cors: {
            origin: '*',
            optionsSuccessStatus: 200
        }
    }).on('connection', ws => {
        ws.emit('answer', welcome);
        ws.on('question', question => {
            bot(question, data).then(answer => {
                // if(answer.score < 0.05) answer.answer = "I don't have sufficient information!";
                console.log(answer.score);
                ws.emit('answer', answer);
            })
        })
    })
})

server.listen(8000, () => {
    console.log('Server is running!');
})
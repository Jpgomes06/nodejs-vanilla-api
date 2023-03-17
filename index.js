const { randomUUID } = require('crypto'); // crypto é módulo nativo do node onde só to usando a funcionalidade randomUUID para gerar um ID
const http = require('http'); // http é o módulo todo
const PORT = 3030; 
const users = []; 

const server = http.createServer((req, res) => { //createserver cria um servidor no meu pc
    res.setHeader("Content-Type", "application/json");
    if(req.url === "/users") {        
        if(req.method === "GET") {
            return res.end(JSON.stringify(users))   //JSON.stringify converte valores em json    
        } 
                                          
        if(req.method === "POST") {  
            req.on("data", (body) => { // informações recebidas
                const dataUser = JSON.parse(body); //converte um json para objeto                      
                const user = { //modulando o body do user
                    id: randomUUID(),   
                    ...dataUser
                };
                
                users.push(user)  
 
            }).on("end", () => { //no final da req faça isso, ou seja, retorne um json (stringify - converte um valor em json) 
                return res.end(JSON.stringify(users));
            });             
        }       

    }  else if(req.url.startsWith("/users")) { //starswith verifica se começa com /users pq no método put eu já vou ter um id gerado em seguida do /users
        if(req.method === "GET") {
            const url = req.url; // atribuo a url enviada pra mim a uma constante chamada url
            const splitURL = url.split("/"); //converte uma string separando em um array
            const idUser = splitURL[2];
    
            const checkIndex = users.findIndex((user) => user.id === idUser);
    
                 if(checkIndex == -1) {
                    return res.end(JSON.stringify(
                        {
                            "details": "user not found",
                            "status": "error message"    
                        }
                    ))
                }
            
            const userIndex = users.filter((user) => user.id === idUser);//filtra o array users todo sobrando somente o que tiver id igual ao idUser
            return res.end(JSON.stringify(userIndex))
        }
        
        if(req.method === "PATCH") {
            const url = req.url; // atribuo a url enviada pra mim a uma constante chamada url
            const splitURL = url.split("/"); //converte uma string separando em um array
            const idUser = splitURL[2]; //pegando somente o ID que está no índice 2

            const checkIndex = users.findIndex((user) => user.id === idUser);//retorna o índice no array do primeiro elemento que satisfizer a função de teste (user) => user.id === idUser

            if(checkIndex == -1) {
                return res.end(JSON.stringify(
                    {
                        "status": "error.message"      
                    }
                )) 
            }

            req.on("data", (data) => { //modifica o body 
                const dataUser = JSON.parse(data);               
                users[checkIndex]  = {  
                    id: idUser,                  
                    ...dataUser 
                };            
                                                    
            }).on("end", () => {
                return res.end(JSON.stringify(users[checkIndex])); //retorna o body já modificado
            });
        }
        
        if(req.method === "PUT") { 
            const url = req.url; // atribuo a url enviada pra mim a uma constante chamada url
            const splitURL = url.split("/"); //converte uma string separando em um array   
            const idUser = splitURL[2];
            
            const checkIndex = users.findIndex((user) => user.id === idUser);//retorna o índice no array do primeiro elemento que satisfizer a função de teste (user) => user.id === idUser
            
            if(checkIndex == -1) {
                return res.end(JSON.stringify(
                    {
                        "status": "error.message"      
                    }
                )) 
            }

            req.on("data", (data) => { //modifica o body
                const dataUser = JSON.parse(data);               
                users[checkIndex]  = {
                    id: idUser,                     
                    ...dataUser 
                };
            }) 
            .on("end", () => {
                return res.end(JSON.stringify(users[checkIndex])); //retorna o body já modificado
            });
        }
        if(req.method === "DELETE") {  
            const url = req.url;         
            const splitURL = url.split("/");      
            const idUser = splitURL[2];            
            
            const userIndex = users.findIndex((user) => user.id === idUser); 
            if(userIndex == -1){
                return res.end(JSON.stringify(                    
                    {
                        "status": "error.message"
                    }                    
                ));
            }          
            users.splice(userIndex, 1)                       
            
            return res.end(JSON.stringify({                    
                        "status": "success"                    
            }));
         }
    }       
})

server.listen(PORT, () =>  //porta seria onde eu estou disponibilizando acesso a minha api
    console.log(`Server is running on ${PORT}`
));

//server.listen = disponibiliza as funcionalidades da const server na porta 3030, em seguida realizad um log
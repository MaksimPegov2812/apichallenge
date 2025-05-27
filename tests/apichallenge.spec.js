
import { test, expect } from '@playwright/test';

test.describe('@challenge API', () => {  
    const URL = 'https://apichallenges.herokuapp.com/';
    let token;
    
    //01 POST/challenger (201) Получение токена
    test.beforeAll(async ({ request }) => {
        const response = await request.post(`${URL}challenger`);
        const headers = await response.headers();
        token = headers['x-challenger'];
        console.log(token); //Вывод полученного токена
        expect (response.status()).toBe(201); //Проверка статуса
        expect(token).not.toBeNull(); //Проверка, что токен не пустой
    });
       
    //02 Get/challenges (200) Получение списка заданий
    test('get challenges', async ({ request }) => {
        const response = await request.get(`${URL}challenges`, {
            headers: { 'x-challenger': token },
        });
        const body = await response.json();
        expect (response.status()).toBe(200); //Проверка статуса ответа
        expect(body.challenges.length).toBe(59); //Проверка количества объектов в теле ответа                          
    }); 

    //03 Get/todos (200) Получение списка задач
    test('get todos', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token },
        });
        const body = await response.json();
        expect (response.status()).toBe(200); //Проверка статуса ответа
        body.todos.forEach(item => {
            expect(item.title).toBeTruthy(); //Проверка, что в каждом элементе массива 'todos' есть заполненный title
        });                        
    });

    //04 Get/todo (404) Получение 404 ошибки по эндпойнту todo
    test('get todo', async ({ request }) => {
        const response = await request.get(`${URL}todo`, {
            headers: { 'x-challenger': token },
        });
        expect(response.status()).toBe(404); //Проверка статуса ответа                                
    });

    //05 Get/todos/id (200) Получение задачи по его id
    test('get todos/id (200)', async ({ request }) => {
        //Получение списка задач по эндпойнту todos
        const createResponse = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token },
        });
        const todos = await createResponse.json();
        //Получение id случайной задачи
        const randomIndex = Math.floor(Math.random() * todos.todos.length);
        const taskId = todos.todos[randomIndex].id;
        //Получение задачи по его id
        const response = await request.get(`${URL}todos/${taskId}`, {
            headers: { 'x-challenger': token },
        });
        const body = await response.json();
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect(body.todos[0].doneStatus).toBeDefined(); //Проверка, что в полученной задаче есть заполненный doneStatus
    });    

    //6 Get/todos/id (404) Получение задачи по несуществующему id
    test('get todos/id (404)', async ({ request }) => {
        const response = await request.get(`${URL}todos/99`, {
            headers: { 'x-challenger': token },
        });
        expect(response.status()).toBe(404); //Проверка статуса ответа                                
    });

    //7 Get/todos?filter (200) Получение задач выполненных/невыполненных задач
    //Получение списка невыполненных задач
    test('get todos?false (200)', async ({ request }) => {
        const response = await request.get(`${URL}todos?doneStatus=false`, {
            headers: { 'x-challenger': token },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const falseDonestatusBody = await response.json();
        expect(falseDonestatusBody.todos.every((todo) => todo.doneStatus === false)).toBeTruthy(); //Проверка что во всех невыполненных задачах doneStatus=false
    });
    //Получение списка невыполненных задач
    test('get todos?true (200)', async ({ request }) => {
        const response = await request.get(`${URL}todos?doneStatus=true`, {
            headers: { 'x-challenger': token },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа   
    });

    //8 Head/todos (200) Получение задачи по несуществующему id
    test('head todos (200)', async ({ request }) => {
        const response = await request.head(`${URL}todos`, {
            headers: { 'x-challenger': token },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const body = await response.body();
        const bodyString = body.toString();
        expect(bodyString).toBe(''); // Проверяем, что тело ответа пустое (пустая строка)
    });

    //9 Post/todos (201) Создание новой задачи
    test('post todos (201)', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "Created Task", doneStatus: true },
        });
        expect(response.status()).toBe(201); //Проверка статуса ответа
        const body = await response.json();
        expect(Number.isInteger(body.id)).toBe(true); // Проверка, что в ответе id - это целое число
    });

    //10 Post/todos (400) doneStatus Создание новой задачи c невалидным значением doneStatus 
    test('post todos (400) doneStatus', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "Created Task", doneStatus: 2 },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Failed Validation: doneStatus should be BOOLEAN")); // Проверка наличия сообщения об ошибке
    });

    //11 Post/todos (400) long title Создание новой задачи cо значением title больше 50 знаков 
    test('post todos (400) long title', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "longtitle".repeat(6), doneStatus: true },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Failed Validation: Maximum allowable length exceeded for title - maximum allowed is 50")); // Проверка наличия сообщения об ошибке
    });

    //12 Post/todos (400) long description Создание новой задачи cо значением discription больше 200 знаков 
    test('post todos (400) long description', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "Created Task", doneStatus: true, description: "longdescription".repeat(14) },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Failed Validation: Maximum allowable length exceeded for description - maximum allowed is 200")); // Проверка наличия сообщения об ошибке
    });

    //13 Post/todos (201) max out content Создание новой задачи c максимальным начением знаков для title (50) и description (200)
    test('post todos (201) max out content', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "NewTesting".repeat(5), doneStatus: true, description: "NewMaxlongdescriptio".repeat(10) },
        });
        expect(response.status()).toBe(201); //Проверка статуса ответа
        const body = await response.json();
        expect(body.description).toHaveLength(200); // Проверка, что длина description равна 200 символам  
    });

    //14 Post/todos (413) content to long Создание новой задачи c превышением payload description (5000 знаков)
    test('post todos (413) content to long', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { description: "A".repeat(5000) },
        });
        expect(response.status()).toBe(413); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Error: Request body too large, max allowed is 5000 bytes")); // Проверка наличия сообщения об ошибке  
    });

    //15 Post/todos (400) extra Создание новой задачи c неопределяемым параметром
    test('post todos (400) extra', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token },
            data: { title: "Created Task", priority: "Medium" },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Could not find field: priority")); // Проверка наличия сообщения об ошибке  
    });

    //16 PUT/todos/id (400) Внесение изменений в задачу с невалидным методом 
    test('put todos/id (400)', async ({ request }) => {
        const response = await request.put(`${URL}todos/300`, {
            headers: { 'x-challenger': token },
            data: { title: "Created Task", doneStatus: true, description: "New Task" },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Cannot create todo with PUT due to Auto fields id")); // Проверка наличия сообщения об ошибке  
    });

    //17 POST/todos/id (200) Внесение изменений в тело задачи 
    test('post todos/id (200)', async ({ request }) => {
        const response = await request.put(`${URL}todos/2`, {
            headers: { 'x-challenger': token },
            data: { title: "updated title" },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const body = await response.json();
        expect(body.title).toBe("updated title");; // Проверка измененного наименования задачи  
    });

    //18 POST/todos/id (404) Внесение изменений в несуществующую задачу 
    test('post todos/id (404)', async ({ request }) => {
        const response = await request.post(`${URL}todos/300`, {
            headers: { 'x-challenger': token },
            data: { title: "updated title" },
        });
        expect(response.status()).toBe(404); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("No such todo entity instance with id")); // Проверка наличия сообщения об ошибке  
    });

    //19 PUT/todos/id (200) full Полное внесение изменений в тело задачи 
    test('put todos/id (200) full', async ({ request }) => {
        const response = await request.put(`${URL}todos/5`, {
            headers: { 'x-challenger': token },
            data: { id: 5, title: "updated title", doneStatus: false, description: "updated description" },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const body = await response.json();
        expect(body.description).toBe("updated description");; // Проверка измененного наименования описания задачи  
    });

    //20 PUT/todos/id (200) partial Частичне внесение изменений в тело задачи 
    test('put todos/id (200) partial', async ({ request }) => {
        const response = await request.put(`${URL}todos/5`, {
            headers: { 'x-challenger': token },
            data: { id: 5, title: "updated title", doneStatus: false, description: "partial updated description" },
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const body = await response.json();
        expect(body.description).toBe("partial updated description");; // Проверка измененного наименования описания задачи  
    });

    //21 PUT/todos/id (400) no title Внесение изменений в задачу без  направления в запросе title 
    test('put todos/id (400) no title', async ({ request }) => {
        const response = await request.put(`${URL}todos/5`, {
            headers: { 'x-challenger': token },
            data: { id: 5, doneStatus: false, description: "partial updated description" },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("title : field is mandatory")); // Проверка наличия сообщения об ошибке  
    });

    //22 PUT/todos/id (400) differ id Внесение изменений в задачу c разными id задачи в эндпойнте и теле запроса 
    test('put todos/id (400) differ id', async ({ request }) => {
        const response = await request.put(`${URL}todos/5`, {
            headers: { 'x-challenger': token },
            data: { id: 6, title: "updated title", doneStatus: false, description: "partial updated description" },
        });
        expect(response.status()).toBe(400); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Can not amend id")); // Проверка наличия сообщения об ошибке  
    });

    //23 DELETE/todos/id (200) Удаление задачи 
    test('delete todos/id (200)', async ({ request }) => {
        const response = await request.delete(`${URL}todos/7`, {
            headers: { 'x-challenger': token }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const getresponse = await request.get(`${URL}todos/7`, {
            headers: { 'x-challenger': token }            
        });
        const body = await getresponse.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Could not find an instance with todos")); // Проверка отсутствия удаленной задачи  
    });

    //24 OPTIONS/todos (200) Получение значений допустимых значений API 
    test('options todos (200) allow', async ({ request }) => {
        const response = await request.fetch(`${URL}todos`, {
            method: "OPTIONS",
            headers: { 'x-challenger': token }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["allow"]).toBeDefined(); // Проверка допустимых значений API в хедере   
    });

    //25 GET/todos (200) xml Получение ответа в формате XML 
    test('get todos (200) xml', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token, 'Accept': "application/xml" }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/xml"); // Проверка в хедере ответа фората xml   
    });

    //26 GET/todos (200) json Получение ответа в формате JSON 
    test('get todos (200) json', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token, 'Accept': "application/json" }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/json"); // Проверка в хедере ответа фората json   
    });

    //27 GET/todos (200) any По умолчанию получение ответа в формате JSON 
    test('get todos (200) any', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token, 'Accept': "*/*" }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/json"); // Проверка по умолчанию в хедере ответа фората json   
    });

    //28 GET/todos (200) xml/json Проверка в хедере ответа фората xml при передаче в хедере обоих форматов 
    test('get todos (200) xml/json', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token, 'Accept': "application/xml, application/json" }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/xml"); // Проверка в хедере ответа фората xml   
    });      

    //29 GET/todos (200) no accept Проверка в хедере ответа фората json при непередаче в хедере accept 
    test('get todos (200) no accept', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token }            
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/json"); // Проверка в хедере ответа фората json   
    });

    //30 GET/todos (406) accept Проверка в хедере неверного формата accept 
    test('get todos (406) accept', async ({ request }) => {
        const response = await request.get(`${URL}todos`, {
            headers: { 'x-challenger': token, 'Accept': "application/gzip" }            
        });
        expect(response.status()).toBe(406); //Проверка статуса ответа        
    });       
    
    //31 POST/todos (201) XML Проверка создания адачи в XML формате 
    test('post todos (201) XML', async ({ request }) => {
        const xmlData = `<todo><title>Created Task</title><doneStatus>true</doneStatus></todo>`;
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token, 'content-type': "application/xml", 'Accept': "application/xml" },
            data: xmlData,                   
        });
        expect(response.status()).toBe(201); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/xml"); // Проверка в хедере ответа фората xml   
    });

    //32 POST/todos (201) json Проверка создания задачи с контентом в json формате 
    test('post todos (201) json', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token, 'content-type': "application/json", 'Accept': "application/json" },
            data: { title: "Created Task", doneStatus: true },            
        });
        expect(response.status()).toBe(201); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/json"); // Проверка в хедере ответа content-type фората json   
    });

    //33 POST/todos (415) Проверка создания задачи с некорректным форматом content-type
    test('post todos (415)', async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { 'x-challenger': token, 'content-type': "mistake", 'Accept': "application/json" },
            data: { title: "Created Task", doneStatus: true },            
        });
        expect(response.status()).toBe(415); //Проверка статуса ответа
        const body = await response.json();
        expect(body.errorMessages).toContainEqual(expect.stringContaining("Unsupported Content Type")); // Проверка наличия сообщения об ошибке   
    });

    //34 GET/challenger{guid} (200) Проверка прогресса пользователя
    test('get challenger{guid} (200)', async ({ request }) => {
        const response = await request.get(`${URL}challenger/${token}`, {
            headers: { 'x-challenger': token },                    
        });
        expect(response.status()).toBe(200); //Проверка статуса ответа
        const body = await response.json();
        expect(body.xChallenger).toEqual(token); //Проверка идентичности токена   
    });

    //35 PUT /challenger/{guid} RESTORE (200)  Проверка восстановлени прогресса пользователя по токену
    test('put challenger/{guid} RESTORE (200)', async ({ request }) => {
        const getResponse = await request.get(`${URL}challenger/${token}`, {
            headers: { 'x-challenger': token },
        });
        const progressData = await getResponse.json();
        // Перезаписываем токен
        const response = await request.put(`${URL}challenger/${token}`, {
            headers: { 'x-challenger': token, 'Content-Type': "application/json" },
        data: progressData,
        });
        const body = await response.json();
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect(body.xChallenger).toEqual(token); //Проверка идентичности токена
    });

    // 36 PUT /challenger/{guid} CREATE (200) Проверка восстановлени прогресса пользователя по GUID
    test("36 put /challenger/{guid} CREATE (200)", async ({ request }) => {
        //Создание нового GUID
        const newChallengerResponse = await request.post(`${URL}challenger`);
        const oldGuid = newChallengerResponse.headers()["x-challenger"];
  
        //Получение прогресса для нового GUID
        const getResponse = await request.get(`${URL}challenger/${oldGuid}`, {
            headers: { 'x-challenger': oldGuid },
        });
        const progressData = await getResponse.json();
  
        //Восстанавление прогресса с использованием текущего токена
        const response = await request.put(`${URL}challenger/${oldGuid}`, {
            headers: { 'x-challenger': token, 'Content-Type': "application/json" },
            data: progressData,
        });
        const body = await response.json(); 
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect(body.xChallenger).toEqual(oldGuid); //Проверка идентичности токена
    });

    // 37 - GET /challenger/database/{guid} (200) Проверка получения массива задач todos
    test("get challenger/database/{guid} (200)", async ({ request }) => {
        const response = await request.get(`${URL}challenger/database/${token}`, {
            headers: { 'x-challenger': token },
        });
        const body = await response.json();
        expect(response.status()).toBe(200); //Проверка статуса ответа
        expect(body).toHaveProperty("todos"); //Проверка получения массива задач todos
    });

    // 38 - PUT /challenger/database/{guid} (204) Проверка восстановления БД todos
    test("put challenger/database/{guid} (204)", async ({ request }) => {
        const todosPayload = {
            todos: [
            { id: 1, title: "New task 1", doneStatus: false, description: "description 1" },
            { id: 2, title: "New task 2", doneStatus: true, description: "description 2" },
            ],
        };
        const response = await request.put(`${URL}challenger/database/${token}`, {
            headers: { "x-challenger": token, "Content-Type": "application/json" },
            data: todosPayload,
        });
        expect(response.status()).toBe(204); //Проверка статуса ответа
    });

    // 39 - POST /todos XML to JSON (201) Проверка создания задачи с Content-Type xml и Accept json 
    test("post /todos XML to JSON (201)", async ({ request }) => {
        const xmlPayload = `<todo><title>XML to JSON</title><doneStatus>false</doneStatus><description>Test</description></todo>`;
        const response = await request.post(`${URL}todos`, {
            headers: { "x-challenger": token, "Content-Type": "application/xml", "Accept": "application/json" },
            data: xmlPayload,
        });
        const body = await response.json();
        expect(response.status()).toBe(201); //Проверка статуса ответа
        expect((await response.headers())["content-type"]).toContain("application/json");
        expect(body.title).toBe("XML to JSON"); //Проверка тела ответа
    });

    // 40 - POST /todos JSON to XML (201) Проверка создания задачи с Content-Type json и Accept xml
    test("post /todos JSON to XML (201)", async ({ request }) => {
        const response = await request.post(`${URL}todos`, {
            headers: { "x-challenger": token, "Content-Type": "application/json", "Accept": "application/xml" },
            data: { title: "JSON to XML", doneStatus: false, description: "Test" },
        });
        const body = await response.text();
        expect(response.status()).toBe(201); //Проверка статуса ответа
        expect(body).toMatch(/<title>JSON to XML<\/title>/); //Проверка тела ответа
    });









    
















});





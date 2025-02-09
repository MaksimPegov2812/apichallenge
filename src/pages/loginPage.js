
//Создание класса страницы https://realworld.qa.guru/#/login
export class LoginPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.loginEmailField = page.getByRole('textbox', { name: 'Email' });
        this.loginPasswordField = page.getByRole('textbox', { name: 'Password' });        
        this.loginButton = page.getByRole('button', { name: 'Login' })
    }

    //Авторизация пользователя
    async gologin(email, password) {
        await this.loginEmailField.fill(email); // Заполнение поля электронной почты
        await this.loginPasswordField.fill(password); // Заполнение поля пароля
        await this.loginButton.click(); // Клик на кнопку входа
    }    
}

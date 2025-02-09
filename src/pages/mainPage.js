//Создание класса страницы
export class MainPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.profileNameField = page.locator('.dropdown-toggle');
        this.singupButton = page.getByRole('link', { name: 'Sign up' });
        this.logoutButton = page.getByRole('link', { name: 'Logout' });
        this.loginButton = page.getByRole('link', { name: 'Login' });        
    }

    //Прописываем асинхронными функциями действия с указанными в конструкторе объектами
    //Открытие Главной страницы
    async open(url) {
        await this.page.goto(url);
    }
    //Клик на кнопку 'Sign up' для авторизации
    async gotoRegister() {
        await this.singupButton.click();
    }
    //Клик на кнопку 'Logout' для выхода из аккаунта
    async gotoLogout() {
        //Шаг раскрытия списка
        await this.profileNameField.click();
        await this.logoutButton.click();
    }
    //Клик на кнопку 'Login' для входа в аккаунт
    async gotoLogin() {
        await this.loginButton.click();
    } 
}

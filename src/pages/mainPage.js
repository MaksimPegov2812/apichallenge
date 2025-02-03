//Создание класса страницы
export class MainPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.singupButton = page.getByRole('link', { name: 'Sign up' });
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
}


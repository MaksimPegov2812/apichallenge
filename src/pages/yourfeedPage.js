
//Создание класса страницы
export class YourfeedPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.profileNameField = page.locator('.dropdown-toggle');
        this.newArticleButton = page.getByRole('link', { name: 'New Article'});
        this.settingButton = page.getByRole('link', { name: 'Settings' });
    }
    //Клик на кнопку "New Article
    async gotoArticle() {
        await this.newArticleButton.click();
    }
    //Клик на кнопку с именем профиля
    async gotoProfile() {
        await this.profileNameField.click();
    }
    //Клик на кнопку "Settings"
    async gotoSettings() {
        await this.settingButton.click();
    }
}

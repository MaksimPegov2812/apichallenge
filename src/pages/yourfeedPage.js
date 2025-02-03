
//Создание класса страницы
export class YourfeedPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.profileNameField = page.getByRole('navigation');
        this.newArticleButton = page.getByRole('link', { name: 'New Article'});
    }

    async gotoArticle() {
        await this.newArticleButton.click();
    }
}

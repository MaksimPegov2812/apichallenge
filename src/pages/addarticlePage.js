
//Страница создания публикации после клика на кнопку "New Article" https://realworld.qa.guru/#/editor
//Создание класса страницы
export class AddArticlePage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.newarticleButton = page.getByRole('link', { name: 'New Article' });
        this.articleTitleField = page.getByRole('textbox', { name: 'Article Title' });
        this.articleAboutField = page.getByRole('textbox', { name: 'What\'s this article about?' });
        this.articleContentField = page.getByRole('textbox', { name: 'Write your article (in' });
        this.articleTagsField = page.getByRole('textbox', { name: 'Enter tags' });
        this.articlePublishButton = page.getByRole('button', { name: 'Publish Article' });        
    }

    //Прописываем асинхронными функциями действия на странице
    //Создание публикации
    async tocreateArticle (title, articleabout, content, tags) {
        await this.articleTitleField.click();
        await this.articleTitleField.fill(title);
        await this.articleAboutField.click();
        await this.articleAboutField.fill(articleabout);
        await this.articleContentField.click();
        await this.articleContentField.fill(content);
        await this.articleTagsField.click();
        await this.articleTagsField.fill(tags);
        await this.articlePublishButton.click();        
    }    
}



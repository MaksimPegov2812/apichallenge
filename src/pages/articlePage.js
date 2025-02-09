
//Страница публикации после клика на кнопку 'Publish Article' https://realworld.qa.guru/#/article/new-article
//Создание класса страницы
export class ArticlePage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.newArticleTitle = page.locator('.container').nth(1);
        this.commentField = page.getByRole('textbox', { name: 'Write a comment...' });
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });  
        this.newCommentArticle = page.locator('.card-block')           
    }

    //Прописываем асинхронными функциями действия на странице
    //Публикация комментария к статье
    async topostCommentArticle (textComment) {
        await this.commentField.click();
        await this.commentField.fill(textComment);        
        await this.postCommentButton.click();        
    }    
}
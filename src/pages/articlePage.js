

//Страница публикации после клика на кнопку 'Publish Article' https://realworld.qa.guru/#/article/new-article

//Создание класса страницы
export class ArticlePage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.newArticleTitle = page.getByRole('heading', { name: 'Title article' });
        //this.newArticleTitle = page.locator("div[class='container'] h1"); 
        this.commentField = page.getByRole('textbox', { name: 'Write a comment...' });
        this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });               
    }

    //Прописываем асинхронными функциями действия по регистрации
    //Публикация комментария к статье
    async topostCommentArticle (textComment) {
        await this.commentField.click();
        await this.commentField.fill(textComment);        
        await this.postCommentButton.click();        
    }
    
}

/* 
  await page.goto('https://realworld.qa.guru/#/article/new-article');
  await page.getByRole('heading', { name: 'New article' }).click();
  await page.goto('https://realworld.qa.guru/');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).fill('maks');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('maks@12');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await page.getByRole('link', { name: 'New Article' }).click();
  await page.getByRole('textbox', { name: 'Article Title' }).click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Title');
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).click();
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('article aout');
  await page.getByRole('textbox', { name: 'Write your article (in' }).click();
  await page.getByRole('textbox', { name: 'Write your article (in' }).fill('article text');
  await page.getByRole('textbox', { name: 'Enter tags' }).click();
  await page.getByRole('textbox', { name: 'Enter tags' }).fill('tags');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await page.getByRole('textbox', { name: 'Article Title' }).click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Title article');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await expect(page.getByRole('heading', { name: 'Title article' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Write a comment...' }).click();
  await page.getByRole('textbox', { name: 'Write a comment...' }).fill('write a comment');
  await page.getByRole('button', { name: 'Post Comment' }).click();
  await expect(page.getByText('write a comment')).toBeVisible();
  */

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../src/pages/mainPage';
import { RegisterPage } from '../src/pages/registerPage';
import { YourFeedPage } from '../src/pages/yourfeedPage';
import { AddArticlePage } from '../src/pages/addarticlePage';
import { ArticlePage } from '../src/pages/articlePage';

const URL_UI = 'https://realworld.qa.guru/';

test.describe('Авторизация пользователя', () => {
    test.beforeEach(async ({ page }) => {
        //объявление констант
        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const yourFeedPage = new YourFeedPage(page);
        const user = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            username: faker.person.firstName()
        };
        //действие на Главной странице     
        await mainPage.open(URL_UI); //открытие страницы
        await mainPage.gotoRegister(); //клик на кнопку регистрации
        await registerPage.register(user.username, user.email, user.password); //регистрация пользователя       
    });        

    test('Создание новой публикации', async ({ page }) => {
        //Объявление констант
        const yourFeedPage = new YourFeedPage(page);
        const addArticlePage = new AddArticlePage(page);        
        const newArticle = {
            title: faker.lorem.sentence(3),            
            articleAbout: faker.lorem.sentence({ min: 3, max: 5 }),
            content: faker.lorem.text(),
            tags: faker.lorem.text(1)
        };
        const articlePage = new ArticlePage(page);        

        //Создание новой публикации
        await yourFeedPage.gotoArticle(); //переход на страницу создания публикации https://realworld.qa.guru/#/editor
        await addArticlePage.tocreateArticle(newArticle.title, newArticle.articleAbout, newArticle.content, newArticle.tags); //создание новой публикации и переход на страницу созданной публикации
        //сравнение заголовков публикации при ее создании и на странице новой публикации
        await expect(articlePage.newArticleTitle).toContainText(newArticle.title);


    });

    test('Создание комментария к публикации', async ({ page }) => {
        //Объявление констант
        const yourFeedPage = new YourFeedPage(page);
        const addArticlePage = new AddArticlePage(page);
        const articlePage = new ArticlePage(page);        
        const newArticle = {
            title: faker.lorem.sentence(3),            
            articleAbout: faker.lorem.sentence({ min: 3, max: 5 }),
            content: faker.lorem.text(),
            tags: faker.lorem.text(1)
        };        
        const commentArticle = {
            comment: faker.lorem.text(),
        };

        //Создание новой публикации
        await yourFeedPage.gotoArticle();
        await addArticlePage.tocreateArticle(newArticle.title, newArticle.articleAbout, newArticle.content, newArticle.tags);    
        //Написание комментария к созданное публикации        
        await articlePage.topostCommentArticle(commentArticle.comment);
        //Сравнение текста написанного и опубликованного комментария к созданной публикации    
        await expect(addArticlePage.newCommentField).toContainText(commentArticle.comment);
      });
})
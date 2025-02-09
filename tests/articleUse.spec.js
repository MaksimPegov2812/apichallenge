
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../src/pages/mainPage';
import { RegisterPage } from '../src/pages/registerPage';
import { YourfeedPage } from '../src/pages/yourfeedPage';
import { AddArticlePage } from '../src/pages/addarticlePage';
import { ArticlePage } from '../src/pages/articlePage';

const URL_UI = 'https://realworld.qa.guru/';

test.describe('Авторизация пользователя', () => {
    test.beforeEach(async ({ page }) => {
        //объявление констант
        const mainPage = new MainPage(page);
        const registerPage = new RegisterPage(page);
        const yourfeedPage = new YourfeedPage(page);
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
        const yourFeedPage = new YourfeedPage(page);
        const addArticlePage = new AddArticlePage(page);        
        const newarticle = {
            title: faker.lorem.sentence(3),            
            articleabout: faker.lorem.sentence({ min: 3, max: 5 }),
            content: faker.lorem.text(),
            tags: faker.lorem.text(1)
        };
        const articlePage = new ArticlePage(page);        

        //Создание новой публикации
        await yourFeedPage.gotoArticle(); //переход на страницу создания публикации https://realworld.qa.guru/#/editor
        await addArticlePage.tocreateArticle(newarticle.title, newarticle.articleabout, newarticle.content, newarticle.tags); //создание новой публикации и переход на страницу созданной публикации
        //сравнение заголовков публикации при ее создании и на странице новой публикации
        await expect(page.locator('.container').nth(1)).toContainText(newarticle.title);
    });

    test('Создание комментария к публикации', async ({ page }) => {
        //Объявление констант
        const yourFeedPage = new YourfeedPage(page);
        const addArticlePage = new AddArticlePage(page);
        const articlePage = new ArticlePage(page);        
        const newarticle = {
            title: faker.lorem.sentence(3),            
            articleabout: faker.lorem.sentence({ min: 3, max: 5 }),
            content: faker.lorem.text(),
            tags: faker.lorem.text(1)
        };        
        const commentarticle = {
            comment: faker.lorem.text(),
        };

        //Создание новой публикации
        await yourFeedPage.gotoArticle();
        await addArticlePage.tocreateArticle(newarticle.title, newarticle.articleabout, newarticle.content, newarticle.tags);    
        //Написание комментария к созданное публикации        
        await articlePage.topostCommentArticle(commentarticle.comment);
        //Ссравнение текста написанного и опубликованного комментария к созданной публикации    
        await expect(page.locator('div > .card-block')).toContainText(commentarticle.comment);
      });
})
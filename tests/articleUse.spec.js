
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage } from '../src/pages/mainPage';
import { RegisterPage } from '../src/pages/registerPage';
import { YourfeedPage } from '../src/pages/yourfeedPage';
import { AddArticlePage } from '../src/pages/addarticlePage';
import { ArticlePage } from '../src/pages/articlePage';


const URL_UI = 'https://realworld.qa.guru/';

test.describe('Действия пользователя с публикациями', () => {
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
            title: "My new Article",
            articleabout: "Article about family",
            content: "This article about my family",
            tags: "family"
        };
        const articlePage = new ArticlePage(page);        

        //Создание новой публикации
        await yourFeedPage.gotoArticle(); //переход на страницу создания публикации https://realworld.qa.guru/#/editor
        await addArticlePage.tocreateArticle(newarticle.title, newarticle.articleabout, newarticle.content, newarticle.tags); //регистрация пользователя
        //await this.articlePublishButton.click();
        //await page.waitForTimeout(5000);
        //сравнение заголовков публикации при ее создании и на странице новой публикации
        await expect(articlePage.newArticleTitle).toContainText(newarticle.title);//https://realworld.qa.guru/#/article/ переход на страницу созданной публикации и сравнение наименования публикации
        
    });        

})
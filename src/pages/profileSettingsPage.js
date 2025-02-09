
//Страница настроек профиля пользователя https://realworld.qa.guru/#/settings
//Создание класса страницы
export class ProfileSettingsPage {
    //В конструкторе присваиваем наименования объектам на странице
    constructor(page) {
        this.page = page;
        this.newPasswordField = page.getByRole('textbox', { name: 'Password' });
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' })                  
    }

    //Прописываем асинхронными функциями действия на странице
    //Изменение пароля профиля
    async tochangePasswordProfile (textnewpassword) {
        await this.newPasswordField.click();
        await this.newPasswordField.fill(textnewpassword);        
        await this.updateSettingsButton.click();        
    }    
}

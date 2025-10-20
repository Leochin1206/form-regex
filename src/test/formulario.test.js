const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Testes Automatizados do Formulário de Cadastro', () => {
  let driver;

  beforeAll(async () => {
    let options = new chrome.Options();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    await driver.manage().setTimeouts({ implicit: 10000 });
  });

  afterAll(async () => {
    await driver.quit();
  });

  // --- Execução do Caso de Teste CT-001 ---
  test('CT-001 | Cadastro com sucesso', async () => {
    try {
      await driver.get('http://localhost:5173/'); 
      await driver.findElement(By.id('nome')).sendKeys('Ana Silva');
      await driver.findElement(By.id('dataNascimento')).sendKeys('15/08/1995');
      await driver.findElement(By.id('email')).sendKeys('ana.silva@email.com');
      await driver.findElement(By.id('nomeUsuario')).sendKeys('ana_silva');
      await driver.findElement(By.id('senha')).sendKeys('Senha@1234');
      await driver.findElement(By.id('cep')).sendKeys('01001000');

      await driver.wait(async () => {
        const ruaValue = await driver.findElement(By.id('rua')).getAttribute('value');
        return ruaValue !== '';
      }, 15000, 'A rua não foi preenchida a tempo.');
      
      await driver.findElement(By.id('numero')).sendKeys('123');
      await driver.findElement(By.id('telefone')).sendKeys('11987654321');
      await driver.findElement(By.xpath("//button[@type='submit' and text()='Cadastrar']")).click();

      await driver.wait(until.alertIsPresent(), 5000);
      let alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      
      expect(alertText).toContain('Formulário enviado com sucesso!');
      await alert.accept();
      
      console.log("Resultado CT-001: Passou");

    } catch (error) {
      console.error("Resultado CT-001: Falhou", error);
      throw error; 
    }
  }, 30000); 

  // --- Execução do Caso de Teste CT-003 ---
  test('CT-003 | Funcionalidade de busca de endereço por CEP válido', async () => {
    try {
      await driver.get('http://localhost:5173/');
      await driver.findElement(By.id('cep')).sendKeys('01001000');

      await driver.wait(async () => {
        const value = await driver.findElement(By.id('rua')).getAttribute('value');
        return value === 'Praça da Sé';
      }, 15000, 'O campo de rua não foi preenchido com o valor esperado.');

      const valorRua = await driver.findElement(By.id('rua')).getAttribute('value');
      expect(valorRua).toBe('Praça da Sé');

      console.log("Resultado CT-003: Passou");

    } catch (error) {
      console.error("Resultado CT-003: Falhou", error);
      throw error;
    }
  }, 30000); 
});


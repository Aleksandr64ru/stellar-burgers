import * as authTokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

const SELECTORS = {
  bun: '[data-cy=bun]',
  main: '[data-cy=main]',
  sauce: '[data-cy=sauce]',
  modal: '#modals > div:first-child',
  overlay: '#modals > div:nth-child(2)',
  closeButton: 'div:first-child > button > svg'
};

function addIngredients() {
  cy.get(`${SELECTORS.bun} > .common_button`).first().click();
  cy.get(`${SELECTORS.main} > .common_button`).first().click();
  cy.get(`${SELECTORS.sauce} > .common_button`).first().click();
}

describe('Интеграционные тесты для страницы конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Тестирование загрузки ингредиентов и добавления их в конструктор', () => {
    it('Добавление булок и ингредиентов в заказ', () => {
      cy.request('/api/ingredients');
      addIngredients();

      const burgerConstructor = {
        bunTop: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .first(),
        mainIngredient: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .eq(1),
        sauceIngredient: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .eq(2),
        bunBottom: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .last()
      };

      burgerConstructor.bunTop.should(
        'contain',
        'Краторная булка N-200i (верх)'
      );
      burgerConstructor.mainIngredient.should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      burgerConstructor.sauceIngredient.should('contain', 'Соус Spicy-X');
      burgerConstructor.bunBottom.should(
        'contain',
        'Краторная булка N-200i (низ)'
      );
    });
  });

  describe('Тестирование работы модального окна для ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get(SELECTORS.bun).first().click();
      cy.get(SELECTORS.modal).as('modal');
      cy.get('@modal')
        .find('div:first-child > h3')
        .contains('Краторная булка N-200i');
    });

    it('Закрытие модального окна по крестику', () => {
      cy.get(SELECTORS.bun).first().click();
      cy.get(SELECTORS.modal).as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').find(SELECTORS.closeButton).should('be.visible').click();
      cy.get(SELECTORS.modal).should('not.exist');
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      cy.get(SELECTORS.bun).first().click();
      cy.get(SELECTORS.modal).as('modal');
      cy.get(SELECTORS.overlay).click({ force: true });
      cy.get(SELECTORS.modal).should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.setCookie('accessToken', authTokens.accessToken);
      localStorage.setItem('refreshToken', authTokens.refreshToken);
      cy.intercept('GET', 'api/auth/tokens', { fixture: 'token.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
    });

    it('Полный прогон создания заказа', () => {
      addIngredients();
      cy.get(
        '#root > div > main > div > section:nth-child(2) > div > button'
      ).click();

      cy.get(SELECTORS.modal).as('orderModal');
      cy.get('@orderModal')
        .find('div:nth-child(2) > h2')
        .contains(orderData.order.number);

      cy.get('@orderModal')
        .find(SELECTORS.closeButton)
        .should('be.visible')
        .click();
      cy.get(SELECTORS.modal).should('not.exist');

      const burgerConstructor = {
        constructorBunTop: cy.get('div > section:nth-child(2) > div'),
        constructoMainIngredient: cy.get(
          'div > section:nth-child(2) > ul > div'
        ),
        constructorBunBottom: cy.get(
          'div > section:nth-child(2) > div:nth-child(3)'
        )
      };

      burgerConstructor.constructorBunTop.should('contain', 'Выберите булки');
      burgerConstructor.constructoMainIngredient.should(
        'contain',
        'Выберите начинку'
      );
      burgerConstructor.constructorBunBottom.should(
        'contain',
        'Выберите булки'
      );
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});

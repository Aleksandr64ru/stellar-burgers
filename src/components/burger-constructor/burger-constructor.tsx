import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/slices/burger-constructor/slice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderSelector
} from '../../services/slices/order/slice';
import { useNavigate } from 'react-router-dom';
import { isAuthCheckedSelector } from '../../services/slices/user/slice';
import { orderBurgerThunk } from '../../services/slices/order/actions';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);
  const isAuthenticated = useSelector(isAuthCheckedSelector);

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const { bun, ingredients } = constructorItems;

    if (!bun || orderRequest) return;

    const orderData: string[] = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];

    dispatch(orderBurgerThunk(orderData));
  };

  const handleCloseOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
  };

  const calculatePrice = (items: typeof constructorItems) => {
    const bunPrice = items.bun ? items.bun.price * 2 : 0;
    const ingredientsPrice = items.ingredients.reduce(
      (total, ingredient) => total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  };

  const price = useMemo(
    () => calculatePrice(constructorItems),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};

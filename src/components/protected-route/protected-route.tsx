import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  isAuthCheckedSelector,
  loginUserRequestSelector
} from '../../services/slices/user/slice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const loginUserRequest = useSelector(loginUserRequestSelector);
  const location = useLocation();

  if (!isAuthChecked && loginUserRequest) {
    return <Preloader />;
  }

  if (!isAuthChecked) {
    if (!onlyUnAuth) {
      return <Navigate to='/login' state={{ from: location }} />;
    }
  }

  if (onlyUnAuth && isAuthChecked) {
    const redirectTo = location.state?.from || { pathname: '/' };
    return <Navigate to={redirectTo} state={location} />;
  }

  return children;
};

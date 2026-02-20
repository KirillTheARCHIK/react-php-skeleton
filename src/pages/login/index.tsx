import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { useHistory } from "react-router-dom";
import "./styles.scss";

import SwitchMode from "components/SwitchMode";
import LoginForm from "widgets/login/LoginForm";
import { clearUserRoles } from "actions/catalogs/userRoles";
import { useTheme } from "@mui/material/styles";

const DEFAULT_PATHNAME = "/";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.currentUser);
  const userRoles = useSelector((state) => state.auth.roles);

  React.useEffect(() => {
    if (userRoles.length) {
      dispatch(clearUserRoles());
    }
  }, [userRoles]);

  React.useEffect(() => {
    const isDiffPathname = location.pathname !== DEFAULT_PATHNAME;
    if (!user && isDiffPathname) {
      history.push(DEFAULT_PATHNAME);
    }
  }, []);

  return (
    <div className="login_page">
      <div className="login_page-left_side"></div>
      <div className="login_page-right_side">
        <div className={`login_page-right_side__switch__${theme.palette.mode}`}>
          <SwitchMode />
        </div>
        <div className="login_page-right_side__logo"></div>
        <div className="login_page-container">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

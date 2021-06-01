import React from "react"
import  "./Login.css"


function Login(onLogin ) {


    return(
        <form className="login__container">
            <h3 className="popup__title login__title">Вход</h3>
            <input
                onChange={onChange}
                value={email || ''}
                className="popup__input login__input"
                type="email"
                name="email"
                placeholder="Email"
                required={}
            />
            <input
                onChange={onChange}
                value={password || ''}
                className="popup__input login__input"
                type="password"
                name="password"
                placeholder="Пароль"
                required
            />
        </form>
    )
}
 export default Login;
const baseAuthUrl = 'https://auth.nomoreparties.co'

export const register = (email, password) => {
    return fetch(`${baseAuthUrl}/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email })
    })
        .then((res) => {
            try {
                if (res.status !== 400){
                    return res.json();
                }
            } catch(err) {
                throw new Error('Некорректно заполнено одно из полей')
            }
        })
        .then((res) => {
            return res;
        })
        .catch((err) => console.log({message: "Некорректно заполнено одно из полей"}));
};

    export const authorize = (email, password) => {
        return fetch(`${baseAuthUrl}/sign-in`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                try {
                    if (res.ok) {
                        return res.json();
                    }
                    if (res.status === 400) {
                        throw new Error('Некоректно заполнено одно из полей')
                    }
                    if (res.status === 401) {
                        throw new Error('Пользователь с email не найден')
                    }
                } catch (e) {
                    console.log(e)
                    return e
                }
            })
            .then(data => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token)
                    return data
                }
            })
            .catch((err) => {return Promise.reject(err.message)})
    }

    export const getContent = (token) => {
        return fetch(`${baseAuthUrl}/user/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                try {
                    if (res.status === 200) {
                        return res.json();
                    }
                    if (res.status === 400) {
                        throw new Error('Токкен не передан или передан не в том формате')
                    }
                    if (res.status === 401) {
                        throw new Error('Переданный токкен некорректен')
                    }
                } catch (e) {
                    console.log(e)
                    return e
                }
            })
            .then(data => {
                return data
            })
            .catch(err => {
                return Promise.reject(err.message)
            })
    }
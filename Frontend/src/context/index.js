import { useReducer, createContext, useEffect } from "react";
import axios from "axios";




// initial state
const intialState = {
    user: null,
};

// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
    switch (action.type) {
        case "USER_INFO":
            return { ...state, user: action.payload};
        default:
            return state;
    }
};

// context provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, intialState);
   
    axios.defaults.baseURL="http://localhost:8000/api";
    axios.defaults.withCredentials = true;

    // useEffect(() => {
    //     dispatch({
    //         type: "LOGIN",
    //         payload: [JSON.parse(localStorage.getItem("user")), localStorage.getItem("type")],
    //     });
    // }, []);

    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            //logout the user
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                return new Promise((resolve, request) => {
                    axios.get('/api/logout')
                        .then((data) => {
                            console.log('/404 error >logout');
                            dispatch({ type: "LOGOUT" })
                            window.localStorage.removeItem('user');
                            window.localStorage.removeItem('type');
                            if (localStorage.getItem("admin") !== null) {
                                window.localStorage.removeItem('admin');
                                
                            } else {
                               
                            }
                        })
                        .catch(err => {
                            console.log('AXIOS INTERCEPTOR ERRORS', err);
                           
                        })
                })
            }
            return Promise.reject(error);
        }
    );
    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get('/csrf-token');
            console.log(data)
            axios.defaults.headers['X-CSRF_Token'] = data.getCsrfToken;
        };
        getCsrfToken();
    }, []);
    return (
        <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
    );
};

export { Context, Provider };

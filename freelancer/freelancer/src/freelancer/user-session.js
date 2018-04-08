const initialState = {
    logged_in : false,
    login_data : null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case 'logged_in' : {
            return{
                logged_in : true,
                login_data : action.payload
            }
        }
        default : {
            return initialState
        }
    }
}

export default reducer;
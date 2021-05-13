let INITIAL_STATE= []
if (typeof window !== "undefined"){
  if (localStorage.getItem("cart")){
    INITIAL_STATE = JSON.parse(localStorage.getItem("cart"))
  } else {
    INITIAL_STATE = []
  }
}

export const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      return action.payload;// spreading is usefull when we have more than one data 
      // but in here we have 1 array so no need to spread state
    default:  
      return state
  }
}
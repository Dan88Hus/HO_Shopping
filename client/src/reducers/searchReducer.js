export const searchReducer = (state = { text: ""}, action) => {
  switch (action.type) {
    case 'SEARCH_QUERY':
      return {...state, ...action.payload};// spreading is usefull when we have more than one data 
      // that maybe we can add another variables in state in future
    default:  
      return state
  }
}
import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return { ...state, errMess: null, comments: action.payload };

    case ActionTypes.COMMENTS_FAILED:
      return { ...state, errMess: action.payload };

    //Assigment 2: Task 2
    case ActionTypes.ADD_COMMENT:
      var comment = action.payload;
      //Set the id to the length of the comments
      comment.id = state.comments.length;
      return { ...state, comments: state.comments.concat(comment) };

    default:
      return state;
  }
};
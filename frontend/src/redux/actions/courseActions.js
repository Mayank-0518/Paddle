export const createCourse = (formData) => async (dispatch) => {
    try {
        dispatch({ type: 'CREATE_COURSE_REQUEST' });
        const response = await courseAPI.createCourse(formData);
        dispatch({ 
            type: 'CREATE_COURSE_SUCCESS', 
            payload: response.data 
        });
    } catch (error) {
        dispatch({ 
            type: 'CREATE_COURSE_FAILURE', 
            payload: error.message 
        });
    }
};

export const updateCourse = (formData) => async (dispatch) => {
    try {
        dispatch({ type: 'UPDATE_COURSE_REQUEST' });
        const response = await courseAPI.updateCourse(formData);
        dispatch({ 
            type: 'UPDATE_COURSE_SUCCESS', 
            payload: response.data 
        });
    } catch (error) {
        dispatch({ 
            type: 'UPDATE_COURSE_FAILURE', 
            payload: error.message 
        });
    }
}; 
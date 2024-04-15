// FormContext.js

import { createContext, useContext, useReducer } from 'react';

const FormContext = createContext();

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_BASIC_INFO':
      return { ...state, basicInfo: action.payload };
    case 'UPDATE_PHOTO_GALLERY':
      return { ...state, photoGallery: action.payload };
    default:
      return state;
  }
};

const FormProvider = ({ children }) => {
  const [formData, dispatch] = useReducer(formReducer, {});

  return (
    <FormContext.Provider value={{ formData, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export { FormProvider, useFormContext };

import errorTemplate from '../templates/error-template.hbs';
export const ErrorDecorator = (target, key, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.log(error.message);
      // document.body.insertAdjacentHTML(
      //   'afterbegin',
      //   errorTemplate({ message: error.message }),
      // );
    }
  };

  return descriptor;
};

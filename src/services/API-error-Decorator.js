import errorTemplate from '../templates/error-template.hbs';
function ErrorDecorator(target, key, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      document.body.insertAdjacentHTML(
        'afterbegin',
        errorTemplate({ message: error.message }),
      );
    }
  };

  return descriptor;
}

export default ErrorDecorator;

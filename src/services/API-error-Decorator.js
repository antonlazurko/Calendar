const ErrorDecorator = (target, key, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = async (...args) => {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.log(error.message);
    }
    return true;
  };

  return descriptor;
};
export default ErrorDecorator;

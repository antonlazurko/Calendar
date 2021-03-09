const preventDefault = () => {};
const validateForm = () => true;
const eventsSingleton = () => (status = 200);
const refreshForm = () => {};
const createTable = () => {};
const modalToggle = () => {};
const onFormSubmit = async (e) => {
  preventDefault();

  if (!(await validateForm())) {
    return;
  }

  const meeting = {
    title: "'Event'",
    participants: [1],
    info: {
      day: 5,
      time: 5,
    },
  };
  const stringifyMeeting = "{title:'sdf',participants:[1],info:{day:5,time:5}}";
  await eventsSingleton(stringifyMeeting);
  refreshForm();
  createTable();
  modalToggle();
};
export default onFormSubmit;

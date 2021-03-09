import 'bootstrap';
import JSON5 from 'json5';

import './sass/style.scss';
import './sass/authModal.scss';

import {
  refreshForm,
  getAvailableMeetings,
  getAvailableMeetingsByParticipant,
  meetingDaysObjGeneration,
  getSelectedMembers,
  userRestructionsHandler,
  markupRender,
  modalToggle,
  onEscPress,
} from './utils/utils';

// import { getEvents, deleteEvent, addEvent } from './services/API-service.js';
// eslint-disable-next-line import/named
import { eventsSingleton } from './services/API-services-Singleton';

import {
  participantSelectEl,
  inputEl,
  formParticipantSelectEl,
  daySelectEl,
  timeSelectEl,
  submitBtn,
  cancelCreateEventBtn,
  createEventBtn,
  tableBody,
  authModal,
  confirmSelect,
  authBtnConfirm,
  authModalBackdrop,
  form,
} from './refs/refs';

import { timeArray, participants, daysArray } from './calendar-data';
import alerts from './alerts/alerts';
import authAlert from './templates/auth-alert.hbs';
import template from './templates/alert-template.hbs';
import selectOptionTemplate from './templates/select-options-template.hbs';
import completeToast from './templates/complete-toast.hbs';

let userId = 0;
const NOTHIG = 'Nothing';
let participant = {};

// markup render
markupRender(
  participants,
  confirmSelect,
  timeArray,
  daysArray,
  formParticipantSelectEl,
  participantSelectEl,
  selectOptionTemplate,
  timeSelectEl,
  daySelectEl,
);
// eslint-disable-next-line no-use-before-define
createTable(userId);

// participant change function
const participantSelectChange = (e) => {
  // eslint-disable-next-line radix
  userId = parseInt(e.target.value);
  // eslint-disable-next-line no-use-before-define
  createTable(userId);
};
// table render function
async function createTable() {
  const meetings = [];
  // using singleton pattern
  await eventsSingleton
    .getEvent()
    // eslint-disable-next-line max-len
    .then((res) =>
      res?.map((event) =>
        meetings.push({ id: event.id, data: JSON5.parse(event.data) }),
      ),
    );
  let rows = '';
  timeArray.map((timeObj, index) => {
    const availableMeetings = getAvailableMeetings(index, meetings);
    const days = new Array(5).fill('');

    if (userId === 0) {
      availableMeetings.map((meeting) =>
        meetingDaysObjGeneration(meeting, days),
      );
    } else {
      getAvailableMeetingsByParticipant(availableMeetings, userId, days);
    }

    rows += `
      <tr class="calendar-row">
          <td>${timeObj.name}</td>
          <td class=${days[0].className}>${days[0].name || ''}</td>
          <td class=${days[1].className}>${days[1].name || ''}</td>
          <td class=${days[2].className}>${days[2].name || ''}</td>
          <td class=${days[3].className}>${days[3].name || ''}</td>
          <td class=${days[4].className}>${days[4].name || ''}</td>
        </tr>`;
    return true;
  });
  tableBody.innerHTML = rows;

  // eslint-disable-next-line no-use-before-define
  tableBody.addEventListener('click', tdDelete);
  userRestructionsHandler(participant, createEventBtn);
}

// table data content delete function
const tdDelete = async (e) => {
  const el = e.target;
  if (el.tagName === 'BUTTON') {
    // eslint-disable-next-line no-alert
    const result = window.confirm(
      `Are you shure you want to delete "${el.parentNode.textContent}" event?`,
    );
    if (result) {
      const meetingId = e.target.getAttribute('data-id');

      // using singletone pattern
      await eventsSingleton.deleteEvent(meetingId).then((status) => {
        if (status === 204) {
          el.parentNode.classList.remove('table-success');
          el.parentNode.innerHTML = '';
          document.body.insertAdjacentHTML(
            'afterbegin',
            completeToast({ message: 'Event succesfuly delete' }),
          );
        }
      });
    }
  }
};

// checking valid data function
const validateForm = async () => {
  if (inputEl.value === '') {
    form.insertAdjacentHTML('afterbegin', template(alerts.input));
    return false;
  }
  if (daySelectEl.value === NOTHIG) {
    form.insertAdjacentHTML('afterbegin', template(alerts.days));
    return false;
  }
  if (timeSelectEl.value === NOTHIG) {
    form.insertAdjacentHTML('afterbegin', template(alerts.time));
    return false;
  }
  if (getSelectedMembers(formParticipantSelectEl).length === 0) {
    form.insertAdjacentHTML('afterbegin', template(alerts.participants));
    return false;
  }
  const meetings = [];

  // using singletone pattern
  await eventsSingleton
    .getEvent()
    .then((res) =>
      res?.map((event) =>
        meetings.push({ id: event.id, data: JSON5.parse(event.data) }),
      ),
    );

  const isAvailableTime = meetings.filter(
    (meeting) =>
      meeting.data.info.day === parseInt(daySelectEl.value, 10) &&
      meeting.data.info.time === parseInt(timeSelectEl.value, 10),
  );
  if (isAvailableTime.length) {
    form.insertAdjacentHTML('afterbegin', template(alerts.unavailable));
    return false;
  }
  return true;
};

// on form submit function
const onFormSubmit = async (e) => {
  e.preventDefault();

  if (!(await validateForm())) {
    return;
  }

  // create event object
  const meeting = {
    title: `'${inputEl.value}'`,
    participants: [...getSelectedMembers(formParticipantSelectEl)],
    info: {
      day: parseInt(daySelectEl.value, 10),
      time: parseInt(timeSelectEl.value, 10),
    },
  };
  const stringifyMeeting = JSON.stringify(meeting).replace(/"/g, '');
  // using singletone pattern
  await eventsSingleton
    .addEvent(
      `{
    "data":"${stringifyMeeting}"
  }`,
    )
    .then((status) => {
      if (status === 200) {
        document.body.insertAdjacentHTML(
          'afterbegin',
          completeToast({ message: 'Event succesfuly added' }),
        );
      }
    });

  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
  createTable(0);
  modalToggle();
};

// on cancel form button click function
const onCancelCreateEventBtn = (e) => {
  e.preventDefault();
  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
  modalToggle();
};

// on auth-modal confirm function
const onAuthConfirm = () => {
  if (confirmSelect.value) {
    participant = participants.find(
      (member) => member.user.id === Number(confirmSelect.value),
    );
    createTable(0);
    userRestructionsHandler(participant, createEventBtn);
    authModalBackdrop.remove();
    createEventBtn.addEventListener('click', () => {
      modalToggle();
      window.addEventListener('keydown', onEscPress);
    });

    return;
  }
  authModal.insertAdjacentHTML('afterbegin', authAlert(alerts.participants));
};

participantSelectEl.addEventListener('change', participantSelectChange);
submitBtn.addEventListener('click', onFormSubmit);
cancelCreateEventBtn.addEventListener('click', onCancelCreateEventBtn);
authBtnConfirm.addEventListener('click', onAuthConfirm);

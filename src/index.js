import 'bootstrap';
import { v4 as uuidv4 } from 'uuid';
import JSON5 from 'json5';

import './sass/style.scss';
import './sass/authModal.scss';

import {
  refreshForm,
  getAvailableMeetings,
  getAvailableMeetingsByParticipant,
  meetingDaysObjGeneration,
  getSelectedMembers,
  selectCreator,
  selectMemberCreator,
  disableBtn,
} from './utils/utils.js';

import { getEvents, deleteEvent, addEvent } from './services/API-service.js';

// import {
//   getParsedLocalStorageData,
//   setLocalStorageData,
// } from './services/localStorageAPI.js';
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
  modal,
  authModalBackdrop,
} from './refs/refs.js';
import {
  timeArray,
  // meetings,
  participants,
  daysArray,
} from './calendar-data.js';
import { alerts } from './alerts/alerts.js';
import authAlert from './templates/auth-alert.hbs';
import template from './templates/alert-template.hbs';
import selectOptionTemplate from './templates/select-options-template.hbs';

// filling state array from LS
// const localStorageData = getParsedLocalStorageData('meetings');
// localStorageData?.map(meeting => meetings.push(meeting));

let userId = 0;
const NOTHIG = 'Nothing';

//markup render
selectMemberCreator(participants, confirmSelect, selectOptionTemplate);
selectMemberCreator(participants, participantSelectEl, selectOptionTemplate);
selectMemberCreator(
  participants,
  formParticipantSelectEl,
  selectOptionTemplate,
);
selectCreator(timeArray, timeSelectEl, selectOptionTemplate);
selectCreator(daysArray, daySelectEl, selectOptionTemplate);
createTable(userId);

//participant change function
const participantSelectChange = e => {
  userId = parseInt(e.target.value);
  createTable(userId);
};
//table render function
async function createTable(userId) {
  let meetings = [];
  await getEvents().then(res =>
    res?.map(event =>
      meetings.push({ id: event.id, data: JSON5.parse(event.data) }),
    ),
  );
  let rows = '';
  timeArray.map((timeObj, index) => {
    const availableMeetings = getAvailableMeetings(index, meetings);
    const days = new Array(5).fill('');

    if (userId === 0) {
      availableMeetings.map(meeting => {
        meetingDaysObjGeneration(meeting, days);
      });
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
  });
  tableBody.innerHTML = rows;

  tableBody.addEventListener('click', tdDelete);
}

//table data content delete function
const tdDelete = async e => {
  // let meetings = [];
  // await getEvents().then(res =>
  //   res.map(event => meetings.push(JSON5.parse(event.data))),
  // );
  const el = e.target;
  if (el.tagName === 'BUTTON') {
    const result = window.confirm(
      `Are you shure you want to delete "${el.parentNode.textContent}" event?`,
    );
    if (result) {
      const meetingId = e.target.getAttribute('data-id');
      await deleteEvent(meetingId);
      // meetings.splice(
      //   meetings.findIndex(function (meeting) {
      //     meeting.id === meetingId;
      //   }),
      //   1,
      // );
      // setLocalStorageData('meetings', meetings);
      el.parentNode.classList.remove('table-success');
      el.parentNode.innerHTML = '';
    }
  }
};

//checking valid info function
const validateForm = async () => {
  let meetings = [];
  await getEvents().then(res =>
    res?.map(event =>
      meetings.push({ id: event.id, data: JSON5.parse(event.data) }),
    ),
  );

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
  const isAvailableTime = meetings.filter(
    meeting =>
      meeting.data.info.day === parseInt(daySelectEl.value) &&
      meeting.data.info.time === parseInt(timeSelectEl.value),
  );
  if (isAvailableTime.length) {
    form.insertAdjacentHTML('afterbegin', template(alerts.unavailable));
    return false;
  }
  // submitBtn.setAttribute('data-bs-dismiss', 'modal');
  return true;
};

//on form submit function
const onFormSubmit = async e => {
  e.preventDefault();

  if (!validateForm()) {
    e.preventDefault();
    // submitBtn.removeAttribute('data-bs-dismiss');
    return;
  }

  //create event object
  const meeting = {
    // id: uuidv4(),
    title: `'${inputEl.value}'`,
    participants: [...getSelectedMembers(formParticipantSelectEl)],
    info: {
      day: parseInt(daySelectEl.value),
      time: parseInt(timeSelectEl.value),
    },
  };
  const stringifyMeeting = JSON.stringify(meeting).replace(/"/g, '');
  await addEvent(`{
    "data":"${stringifyMeeting}"
  }`);

  //pushing event object to events array and filling LS
  // meetings.push(meeting);
  // setLocalStorageData('meetings', meetings);
  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
  createTable();
  // customModalClose();
};

//on cancel form button click function
const onCancelCreateEventBtn = e => {
  e.preventDefault();
  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
};

//on auth-modal confirm function
const onAuthConfirm = () => {
  if (confirmSelect.value) {
    createTable(0);
    const participant = participants.find(participant => {
      return participant.user.id === Number(confirmSelect.value);
    });
    if (!participant.isAdmin) {
      disableBtn(createEventBtn);
      // createEventBtn.setAttribute('disabled', 'true');
      const tableRemoveBtn = document.querySelectorAll('.btn-remove');
      tableRemoveBtn.forEach(btn => disableBtn(btn));
    }
    authModalBackdrop.remove();
    return;
  }
  authModal.insertAdjacentHTML('afterbegin', authAlert(alerts.participants));
  return;
  // alert('Choose member');
};

participantSelectEl.addEventListener('change', participantSelectChange);
submitBtn.addEventListener('click', onFormSubmit);
cancelCreateEventBtn.addEventListener('click', onCancelCreateEventBtn);
authBtnConfirm.addEventListener('click', onAuthConfirm);

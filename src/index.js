import 'bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './sass/style.scss';
import {
  refreshForm,
  getAvailableMeetings,
  getAvailableMeetingsByParticipant,
  meetingDaysObjGeneration,
  getSelectedMembers,
  selectCreator,
  customModalClose,
} from './utils/utils';
import {
  getParsedLocalStorageData,
  setLocalStorageData,
} from './services/localStorageAPI';
import {
  participantSelectEl,
  inputEl,
  formParticipantSelectEl,
  daySelectEl,
  timeSelectEl,
  submitBtn,
  cancelCreateEventBtn,
  tableBody,
} from './refs/refs';
import { timeArray, meetings, participants, daysArray } from './calendar-data';
import { alerts } from './alerts/alerts';
import template from './templates/alert-template.hbs';
import selectOptionTemplate from './templates/select-options-template.hbs';

//filling state array from LS
const localStorageData = getParsedLocalStorageData('meetings');
localStorageData?.map(meeting => meetings.push(meeting));

let userId = 0;
const NOTHIG = 'Nothing';

//markup render
selectCreator(participants, participantSelectEl, selectOptionTemplate);
selectCreator(participants, formParticipantSelectEl, selectOptionTemplate);
selectCreator(timeArray, timeSelectEl, selectOptionTemplate);
selectCreator(daysArray, daySelectEl, selectOptionTemplate);
createTable(userId);

//participant change function
function participantSelectChange(e) {
  userId = parseInt(e.target.value);
  createTable(userId);
}
//table render function
function createTable(userId) {
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
function tdDelete(e) {
  const el = e.target;
  if (el.tagName === 'BUTTON') {
    const result = window.confirm(
      `Are you shure you want to delete "${el.parentNode.textContent}" event?`,
    );
    if (result) {
      const meetingId = e.target.getAttribute('data-id');
      meetings.splice(
        meetings.findIndex(function (meeting) {
          meeting.id === meetingId;
        }),
        1,
      );
      setLocalStorageData('meetings', meetings);
      el.parentNode.classList.remove('table-success');
      el.parentNode.innerHTML = '';
    }
  }
}

//checking valid info function
function validateForm() {
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
      meeting.info.day === parseInt(daySelectEl.value) &&
      meeting.info.time === parseInt(timeSelectEl.value),
  );
  if (isAvailableTime.length) {
    form.insertAdjacentHTML('afterbegin', template(alerts.unavailable));
    return;
  }
  // submitBtn.setAttribute('data-bs-dismiss', 'modal');
  return true;
}

//on form submit function
function onFormSubmit(e) {
  // e.preventDefault();

  if (!validateForm()) {
    e.preventDefault();
    // submitBtn.removeAttribute('data-bs-dismiss');
    return;
  }

  //create event object
  const meeting = {
    id: uuidv4(),
    title: inputEl.value,
    participants: [...getSelectedMembers(formParticipantSelectEl)],
    info: {
      day: parseInt(daySelectEl.value),
      time: parseInt(timeSelectEl.value),
    },
  };

  //pushing event object to events array and filling LS
  meetings.push(meeting);
  setLocalStorageData('meetings', meetings);
  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
  createTable(0);
  // customModalClose();
}

//on cancel form button click function
function onCancelCreateEventBtn(e) {
  e.preventDefault();
  refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
  );
}
participantSelectEl.addEventListener('change', participantSelectChange);
submitBtn.addEventListener('click', onFormSubmit);
cancelCreateEventBtn.addEventListener('click', onCancelCreateEventBtn);

import { v4 as uuidv4 } from 'uuid';
import utils from './utils/utils';
import {
  memberSelectEl,
  calendarData,
  eventDeleteBtn,
  inputEl,
  userSelectEl,
  daySelectEl,
  timeSelectEl,
  submitBtn,
  cancelCreateEventBtn,
} from './refs/refs';
import { daysArray, timeArray, participants, meetings } from './calendar-data';
let userId = '';
function memberSelectChange(e) {
  userId = e.target.value;
  createTable(userId);
}
//table render function
const createTable = userId => {
  const table = document.querySelector('#table');
  const tableBody = table.querySelector('tbody');
  let rows = '';
  timeArray.map((timeObj, index) => {
    const availableMeetings = utils.getAvailableMeetings(index, meetings);
    const days = new Array(5).fill('');
    switch (userId) {
      case '':
        availableMeetings.map(meeting => {
          const day = meeting.info.day;
          days[day] = {
            name: `${meeting.title} <a class="btn-remove" data-id="${meeting.id}" href="#">remove</a>`,
            id: meeting.id,
          };
        });
        break;
      case '0':
        utils.getgetAvailableMeetingsByParticipant(
          availableMeetings,
          userId,
          days,
        );
        break;
      case '1':
        utils.getgetAvailableMeetingsByParticipant(
          availableMeetings,
          userId,
          days,
        );
        break;
      case '2':
        utils.getgetAvailableMeetingsByParticipant(
          availableMeetings,
          userId,
          days,
        );
        break;
      case '3':
        utils.getgetAvailableMeetingsByParticipant(
          availableMeetings,
          userId,
          days,
        );

        break;
      default:
        return;
    }

    rows += `
      <tr class="calendar-row">
          <td>${timeObj.value}</td>
          <td>${days[0].name || ''}</td>
          <td>${days[1].name || ''}</td>
          <td>${days[2].name || ''}</td>
          <td>${days[3].name || ''}</td>
          <td>${days[4].name || ''}</td>
        </tr>`;
  });
  tableBody.innerHTML = rows;

  tableBody.addEventListener('click', function (e) {
    const el = e.target;
    if (el.tagName === 'A') {
      const meetingId = e.target.getAttribute('data-id');
      meetings.splice(
        meetings.findIndex(function (meeting) {
          return meeting.id === meetingId;
        }),
        1,
      );
      el.parentNode.innerHTML = '';
    }
    return;
  });
};
createTable(userId);

//on form submit function
function onFormSubmit(e) {
  e.preventDefault();
  utils.getSelectedMembers(userSelectEl);
  const meeting = {
    id: uuidv4(),
    title: inputEl.value,
    participants: [...utils.getSelectedMembers(userSelectEl)],
    info: {
      day: parseInt(daySelectEl.value),
      time: parseInt(timeSelectEl.value),
    },
  };
  meetings.push(meeting);
  inputEl.value = '';
  daySelectEl.value = null;
  timeSelectEl.value = null;
  userSelectEl.value = null;
  memberSelectEl.value = '';
  createTable('');

  console.log(meetings);
}
memberSelectEl.addEventListener('change', memberSelectChange);
submitBtn.addEventListener('click', onFormSubmit);

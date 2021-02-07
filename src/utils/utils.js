//form options clean function
export function refreshForm(
  inputEl,
  daySelectEl,
  timeSelectEl,
  userSelectEl,
  memberSelectEl,
) {
  inputEl.value = '';
  daySelectEl.value = null;
  timeSelectEl.value = null;
  userSelectEl.value = null;
  memberSelectEl.value = 0;
}

//get meetings for current time
export function getAvailableMeetings(index, array) {
  return array.filter(meeting => {
    return meeting.info.time === index;
  });
}

//get meetings by participant
export function getAvailableMeetingsByParticipant(
  meetingsArray,
  userId,
  daysArray,
) {
  meetingsArray.map(meeting => {
    if (meeting.participants.includes(userId)) {
      meetingDaysObjGeneration(meeting, daysArray);
    }
  });
}
export function meetingDaysObjGeneration(meetingObj, daysArr) {
  const day = meetingObj.info.day;
  daysArr[day] = {
    name: `${meetingObj.title} <button type="button" class="btn-close btn-remove" data-id="${meetingObj.id}"></button>`,
    id: meetingObj.id,
    className: 'table-success',
  };
}
//get  selected participants from form
export function getSelectedMembers(userSelectEl) {
  const values = [];
  const select = userSelectEl.options;
  if (userSelectEl.multiple) {
    for (let i = 0; i < select.length; i += 1) {
      if (select[i].selected) values.push(parseInt(select[i].value));
    }
  } else {
    values.push(parseInt(userSelectEl.value));
  }
  return values;
}
export function customModalClose() {
  const modal = document.querySelector('.modal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('style', 'display: none;');
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('role');
  document.body.classList.remove('modal-open');
  const backdrop = document.querySelector('.modal-backdrop');
  document.body.removeChild(backdrop);
}

//select options render function
export function selectCreator(participants, node, selectOtionTemplate) {
  participants.map(participant => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(participant));
  });
}

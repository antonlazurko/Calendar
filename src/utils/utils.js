import JSON5 from 'json5';
//form options clean function
export const refreshForm = (
  inputEl,
  daySelectEl,
  timeSelectEl,
  userSelectEl,
  memberSelectEl,
) => {
  inputEl.value = '';
  daySelectEl.value = null;
  timeSelectEl.value = null;
  userSelectEl.value = null;
  memberSelectEl.value = 0;
};

//get meetings for current time
export const getAvailableMeetings = (index, array) => {
  return array.filter(meeting => {
    return meeting.data.info.time === index;
  });
};

//get meetings by participant
export const getAvailableMeetingsByParticipant = (
  meetingsArray,
  userId,
  daysArray,
) => {
  meetingsArray.map(meeting => {
    if (meeting.data.participants.includes(userId)) {
      meetingDaysObjGeneration(meeting, daysArray);
    }
  });
};

export const meetingDaysObjGeneration = (meetingObj, daysArr) => {
  const day = meetingObj.data.info.day;
  daysArr[day] = {
    name: `${meetingObj.data.title} <button type="button" class="btn-close btn-remove" data-id="${meetingObj.id}"></button>`,
    id: meetingObj.id,
    className: 'table-success ',
  };
};
//get  selected participants from form
export const getSelectedMembers = userSelectEl => {
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
};

export const customModalClose = () => {
  const modal = document.querySelector('.modal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('style', 'display: none;');
  modal.removeAttribute('aria-modal');
  modal.removeAttribute('role');
  document.body.classList.remove('modal-open');
  const backdrop = document.querySelector('.modal-backdrop');
  document.body.removeChild(backdrop);
};

//select options render function
export const selectCreator = (array, node, selectOtionTemplate) => {
  array.map(item => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(item));
  });
};

//select member options render function
export const selectMemberCreator = (array, node, selectOtionTemplate) => {
  array.map(item => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(item.user));
  });
};

//hidden functional btns for 'users'
export const disableBtn = btn => {
  btn.setAttribute('disabled', 'true');
};

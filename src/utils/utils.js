// form options clean function
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
// get meetings for current time
export const getAvailableMeetings = (index, array) =>
  array.filter((meeting) => meeting.data.info.time === index);

// get meetings by participant
export const getAvailableMeetingsByParticipant = (
  meetingsArray,
  userId,
  daysArray,
) => {
  meetingsArray.map((meeting) => {
    if (meeting.data.participants.includes(userId)) {
      meetingDaysObjGeneration(meeting, daysArray);
    }
    return true;
  });
};

export const meetingDaysObjGeneration = (meetingObj, daysArr) => {
  const { day } = meetingObj.data.info;
  daysArr[day] = {
    name: `${meetingObj.data.title} <button type="button" class="btn-close btn-remove" data-id="${meetingObj.id}"></button>`,
    id: meetingObj.id,
    className: 'table-success ',
  };
};
// get  selected participants from form
export const getSelectedMembers = (userSelectEl) => {
  const values = [];
  const select = userSelectEl.options;
  if (userSelectEl.multiple) {
    for (let i = 0; i < select.length; i += 1) {
      if (select[i].selected) values.push(parseInt(select[i].value, 10));
    }
  } else {
    values.push(parseInt(userSelectEl.value, 10));
  }
  return values;
};
export const modalToggle = () => {
  const createModal = document.querySelector('.create-modal-backdrop');
  createModal.classList.toggle('create-modal-close');
};

export const onEscPress = (event) => {
  if (event.code === 'Escape') {
    modalToggle();
    window.removeEventListener('keydown', onEscPress);
  }
};

// select options render function
export const selectCreator = (array, node, selectOtionTemplate) => {
  array.map((item) => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(item));
    return true;
  });
};

// select member options render function
export const selectMemberCreator = (array, node, selectOtionTemplate) => {
  array.map((item) => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(item.user));
    return true;
  });
};

// hidden functional btns for 'users'
export const disableBtn = (btn) => {
  btn.setAttribute('disabled', 'true');
};

// realized restrictions for autorized user
export const userRestructionsHandler = (participant, createEventBtn) => {
  createEventBtn.removeAttribute('disabled');

  if (!participant.isAdmin) {
    disableBtn(createEventBtn);
    const tableRemoveBtn = document.querySelectorAll('.btn-remove');
    tableRemoveBtn.forEach((btn) => disableBtn(btn));
  }
};

// markup render
export const markupRender = (
  participants,
  confirmSelect,
  timeArray,
  daysArray,
  formParticipantSelectEl,
  participantSelectEl,
  selectOptionTemplate,
  timeSelectEl,
  daySelectEl,
) => {
  selectMemberCreator(participants, confirmSelect, selectOptionTemplate);
  selectMemberCreator(participants, participantSelectEl, selectOptionTemplate);
  selectMemberCreator(
    participants,
    formParticipantSelectEl,
    selectOptionTemplate,
  );
  selectCreator(timeArray, timeSelectEl, selectOptionTemplate);
  selectCreator(daysArray, daySelectEl, selectOptionTemplate);
};

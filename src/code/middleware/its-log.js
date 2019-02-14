import actionTypes from '../action-types';
import templates from '../templates';
import GuideProtocol from '../utilities/guide-protocol';
import { GUIDE_CONNECTED, GUIDE_ERRORED,
  GUIDE_HINT_RECEIVED, GUIDE_ALERT_RECEIVED } from '../modules/notifications';
import { requestRemediation } from '../modules/remediation';
import GeneticsUtils from '../utilities/genetics-utils';
import io from 'socket.io-client';
import AuthoringUtils from '../utilities/authoring-utils';
import { cloneDeep } from 'lodash';
import uuid from 'uuid';

var socket = null,
    session = "",
    lastActionSequenceId = -1,
    isConnectonEstablished = false,
    msgQueue = [],
    ITS_groupId = "GUIDE-3.10";

export function initializeITSSocket(guideServer, socketPath, store) {
  socket = io(guideServer, {
    path: socketPath,
    reconnection: false
  });

  socket.on('connect', data =>
    store.dispatch({type: GUIDE_CONNECTED, data})
  );

  const receiveITSEvent = (data) => {
    var event = GuideProtocol.Event.fromJson(data);
    console.info(`%c Received from ITS: ${event.action} ${event.target}`, 'color: #f99a00', event);

    if (event.sequence > -1 && event.sequence !== lastActionSequenceId) {
      console.info(`%c Dropping ${event.action} event as stale`, 'color: #f99a00', event);
      return;
    }

    if (event.isMatch("ITS", "HINT", "USER")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS provided hint to user:", event);
      store.dispatch({type: GUIDE_HINT_RECEIVED, data: event});
    } else if (event.isMatch("ITS", "REMEDIATE", "USER")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS offered user remediation:", event);
      store.dispatch(requestRemediation(event));
    } else if (event.isMatch("ITS", "SPOKETO", "USER")) {
      // do nothing with this
      console.log("ITS spoke to user:", event.context.dialog);
    } else if (event.isMatch("ITS", "ISSUED", "ALERT")) {
      // TODO: Remove console log once ITS debugging is complete
      console.log("ITS alerted user:", event);
      store.dispatch({type: GUIDE_ALERT_RECEIVED, data: event});
    } else {
      console.log("%c Unhandled ITS message:", 'color: #f99a00', event.toString());
    }
  };

  socket.on(GuideProtocol.Event.Channel, receiveITSEvent);

  // for testing
  // e.g.
  // GV_TEST_receiveITSEvent(JSON.stringify({actor: "ITS", action: "REMEDIATE", target: "USER", context: {attribute: "sex", challengeType: "Hatchery"}}))
  window.GV_TEST_receiveITSEvent = receiveITSEvent;

  socket.on('error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );
  socket.on('connect_error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );
  socket.on('reconnect_error', data =>
    store.dispatch({type: GUIDE_ERRORED, data})
  );

  return socket;
}

let studentId;

export default loggingMetadata => store => next => action => {

  let prevState = store.getState(),
      result = next(action),
      nextState = store.getState();

  if (loggingMetadata.studentId){
    studentId = loggingMetadata.studentId;
  } else if (!loggingMetadata.studentId && !studentId) {
    // sets an anonymous user for the ITS
    studentId = "TEMP-TestUser-" + (uuid.v4().split("-")[0]);
  }

  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  switch(action.type) {
    case GUIDE_ERRORED: {
      console.log("%c Error connecting to ITS!", 'color: #f99a00');
      socket.close();
      break;
    }
    case GUIDE_CONNECTED: {
      console.log("%c ITS Connection Success!", 'color: #f99a00');
      if (msgQueue.length) {
        msgQueue.forEach((msg, index) => {
          // use setTimeout to stagger messages sent to ITS
          setTimeout(() => {
            console.log("%c Sending queued message to ITS:", 'color: #f99a00', msg);
            sendMessage(msg, socket);
          }, 10 * index);
        });
        msgQueue = [];
      }
      isConnectonEstablished = true;
      break;
    }
    case GUIDE_HINT_RECEIVED:
    case GUIDE_ALERT_RECEIVED: {
      break;
    }
    default: {
      // other action types - send to ITS
      if (action.meta && action.meta.itsLog){
        let message = createLogEntry(loggingMetadata, action, prevState, nextState);
        if (!isConnectonEstablished) {
          console.log("%c Queuing message for ITS:", 'color: #f99a00', message);
          msgQueue.push(message);
        }
        else {
          console.log("%c Sending message to ITS:", 'color: #f99a00', message, JSON.stringify(message));
          sendMessage(message, socket);
        }
      }
    }
  }

  return result;
};

function sendMessage(message, socket) {
  socket.emit(GuideProtocol.Event.Channel, JSON.stringify(message));
}

function getValue(obj, path) {
  for (let i=0, ii=path.length; i<ii; i++){
      obj = obj[path[i]];
  }
  return obj;
}

// exported for unit test purposes
export function makeMutable(obj) {
  if (!obj) return obj;
  if (obj.asMutable) {
    return obj.asMutable({deep: true});
  } else if (obj.isArray) {
    for (let item of obj) {
      item = makeMutable(item);
    }
  } else if (typeof obj === "object") {
    for (let key in obj) {
      obj[key] = makeMutable(obj[key]);
    }
  }
  return obj;
}

// exported for unit test purposes
export function changePropertyValues(obj, key, func) {
  if (!obj) return;
  if (obj.isArray) {
    for (let item of obj) {
      changePropertyValues(item, key, func);
    }
  } else for (let prop in obj) {
      if (prop === key) {
        obj[prop] = func(obj[prop]);
      } else if (typeof obj[prop] === "object") {
        changePropertyValues(obj[prop], key, func);
      }
    }
}

function matchITSAction(action, itsActionName, itsTargetName) {
  if (action.meta.itsLog) {
    return (action.meta.itsLog.action === itsActionName && action.meta.itsLog.target === itsTargetName);
  }
}

function getChallengeType(state) {
  if (state.template === "FVEggSortGame") {
    return "Hatchery";
  }
  if (state.template === "ClutchGame") {
    if (state.challengeType && state.challengeType === "match-target") {
      return "Breeding";
    } else if (state.challengeType && state.challengeType === "submit-parents") {
      return "Siblings";
    } else if (state.challengeType && state.challengeType === "test-cross") {
      return "TestCross";
    }
  }
  if (state.template === "FVEggGame" ||
      state.challengeType && state.challengeType === "match-target") {
    return "Sim";
  }
}

function getSelectableAttributes(nextState) {
  if (nextState.template && nextState.template === "FVGenomeChallenge") {
    return ["sex", ...nextState.userChangeableGenes];
  }
  if (nextState.template && nextState.template === "FVEggSortGame") {
    if (nextState.baskets && nextState.baskets[0] && nextState.baskets[0].sex !== undefined) {
      return ["sex", ...nextState.visibleGenes];
    } else {
      return [...nextState.visibleGenes];
    }
  }
  if (nextState.template && nextState.template === "ClutchGame") {
    if (nextState.userChangeableGenes) {
      let selectableAttributes = nextState.userChangeableGenes[0].mother.length > 0 ? nextState.userChangeableGenes[0].mother : nextState.userChangeableGenes[0].father;
      return [...selectableAttributes];
    }
  }
  if (nextState.template && nextState.template === "FVEggGame") {
    if (nextState.visibleGenes) {
      return ["sex", ...nextState.visibleGenes];
    }
  }
}

// curried, to make it easier for mapping
function getDrake(state) {
  return (i) => {
    let targetDrakeOrg = GeneticsUtils.convertDrakeToOrg(state.drakes[i]);
    return {
      sex: targetDrakeOrg.sex,
      phenotype: targetDrakeOrg.phenotype.characteristics
    };
  };
}
function getTarget(nextState) {
  let targetIndex, targetIndices;
  if ((nextState.template && nextState.template === "FVGenomeChallenge") &&
      (nextState.challengeType && nextState.challengeType === "match-target")) {
    targetIndex = 1;
  } else if (nextState.template && nextState.template === "ClutchGame") {
    if (nextState.challengeType && nextState.challengeType === "match-target") {
      targetIndices = [2];
    } else if (nextState.challengeType && nextState.challengeType === "submit-parents") {
      targetIndices = Array(nextState.numTargets).fill().map((e, i) => i + 2);  // [2, ... n]
    }
  }

  if (!targetIndex && !targetIndices) {
    return;
  }

  if (targetIndex) {
    return getDrake(nextState)(targetIndex);
  } else {
    return targetIndices.map(getDrake(nextState));
  }
}

/**
 * The new state of the user's drakes after a change, or the changeable parents' alleles in any clutch-game event
 */
function getSelected(action, nextState) {
  if ((action.type === actionTypes.ALLELE_CHANGED) && (nextState.template && nextState.template === "FVGenomeChallenge")) {
    let userDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[0]);
    return {
      sex: userDrakeOrg.sex,
      alleles: userDrakeOrg.getAlleleString()
    };
  } else if (nextState.template && nextState.template === "ClutchGame") {
    let motherDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[0]);
    let fatherDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[1]);
    const selected = {};
    if (nextState.userChangeableGenes && nextState.userChangeableGenes[0].mother && nextState.userChangeableGenes[0].mother.length > 0) {
      selected.motherAlleles = motherDrakeOrg.getAlleleString();
    }
    if (nextState.userChangeableGenes && nextState.userChangeableGenes[0].father && nextState.userChangeableGenes[0].father.length > 0) {
      selected.fatherAlleles = fatherDrakeOrg.getAlleleString();
    }
    return selected;
  }
  return null;
}

/**
 * The fixed parent's alleles in any clutch-game event
 */
function getConstant(action, nextState) {
  if (nextState.template && nextState.template === "ClutchGame") {
    let motherDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[0]);
    let fatherDrakeOrg = GeneticsUtils.convertDrakeToOrg(nextState.drakes[1]);
    const constant = {};
    if (!nextState.userChangeableGenes || !nextState.userChangeableGenes[0].mother || nextState.userChangeableGenes[0].mother.length === 0) {
      constant.motherAlleles = motherDrakeOrg.getAlleleString();
    }
    if (!nextState.userChangeableGenes || !nextState.userChangeableGenes[0].father || nextState.userChangeableGenes[0].father.length === 0) {
      constant.fatherAlleles = fatherDrakeOrg.getAlleleString();
    }
    return constant;
  }
}

/**
 * The old state of the user's drakes before a change. The ITS is now keeping track of most of the old
 * states, so this is now *only* used for allele-change events.
 */
function getPrevious(selected, action, prevState) {
  if (action.type === actionTypes.ALLELE_CHANGED) {
    return getSelected(action, prevState);
  }
}

function getClutch(action, state) {
  if (matchITSAction(action, "SELECTED", "OFFSPRING")) {
    // last eight indices of drake array
    const targetIndices = Array(8).fill().map((e, i) => i + (state.drakes.length - 8));
    return targetIndices.map(getDrake(state));
  }
}

function createLogEntry(loggingMetadata, action, prevState, nextState){
  let event = { ...action.meta.itsLog },
      context = { ...action },
      routeSpec = nextState.routeSpec;

  context.routeSpec = routeSpec;
  context.groupId = ITS_groupId;
  context.challengeId = AuthoringUtils.getChallengeId(nextState.authoring, routeSpec);
  context.classId = loggingMetadata.classInfo;

  let challengeType = getChallengeType(prevState);
  if (challengeType) {
    context.challengeType = challengeType;
  }

  let selectableAttributes = getSelectableAttributes(nextState);
  if (selectableAttributes) {
    context.selectableAttributes = selectableAttributes;
  }

  let target = context.target || getTarget(prevState);
  if (target) {
    context.target = target;
  }

  let previous = getPrevious(context.selected, action, prevState);
  if (previous) {
    context.previous = previous;
  }

  let selected = context.selected || getSelected(action, nextState);
  if (selected) {
    // manually remove fixed mother or father if it was passed in via the context
    if (selected.motherAlleles && (!nextState.userChangeableGenes || !nextState.userChangeableGenes[0].mother || nextState.userChangeableGenes[0].mother.length === 0)) {
      delete selected.motherAlleles;
    }
    if (selected.fatherAlleles && (!nextState.userChangeableGenes || !nextState.userChangeableGenes[0].father || nextState.userChangeableGenes[0].father.length === 0)) {
      delete selected.fatherAlleles;
    }
    context.selected = selected;
  }

  let constant = getConstant(action, nextState);
  if (constant) {
    context.constant = constant;
  }

  let clutch = getClutch(action, nextState);
  if (clutch) {
    context.clutch = clutch;
  }

  if (action.meta.logNextState) {
    for (let prop in action.meta.logNextState) {
      context[prop] = getValue(nextState, action.meta.logNextState[prop]);
    }
  }
  if (action.meta.logTemplateState) {
    let Template = templates[nextState.template];
    if (Template.logState) {
      let templateState = Template.logState(nextState);
      context = {
        ...context,
        ...templateState
      };
    }
  }
  if (action.meta.dontLog) {
    for (let prop of action.meta.dontLog) {
      delete context[prop];
    }
  }

  delete context.type;
  delete context.meta;

  context = makeMutable(cloneDeep(context));

  let changeSexToString = sex => sex === 0 ? "male" : sex === 1 ? "female" : sex;
  changePropertyValues(context, "sex", changeSexToString);
  changePropertyValues(context, "newSex", changeSexToString);

  if (prevState.remediation) {
    context.remediation = true;
    context.challengeId = `${context.challengeId}-REMEDIATION`;
  }

  lastActionSequenceId++;

  const message =
    {
      classInfo: loggingMetadata.classInfo,
      studentId: studentId,
      externalId: loggingMetadata.externalId,
      session: session,
      time: Date.now(),
      sequence: lastActionSequenceId,
      ...event,
      context: context
    };

  return message;
}

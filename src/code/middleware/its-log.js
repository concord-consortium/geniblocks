import { actionTypes } from '../actions';
import templates from '../templates';

var session = "",
    sequence = 0,
    queue = [];

export default (socket) => store => next => action => {

  let result = next(action),
      nextState = store.getState();

  if (action.type === actionTypes.SESSION_STARTED) {
    session = action.session;
  }

  switch(action.type) {
    case actionTypes.SOCKET_ERRORED: {
      console.log("Error connecting to ITS");
      socket.close();
      break;
    }
    case actionTypes.SOCKET_CONNECTED: {
      console.log("Connection Success!");
      flushQueue(socket);
      break;
    }
    case actionTypes.SOCKET_RECEIVED: {
      console.log("Message received!", action.state.data);
      break;
    }
    default: {
      // other action types - send to ITS
      if (action.meta && action.meta.itsLog){

        let message = createLogEntry(action, nextState);

        switch (socket.readyState) {
          case WebSocket.CONNECTING:
            queue.push(message);
            break;
          case WebSocket.OPEN:
            flushQueue(socket);
            sendMessage(message, socket);
            break;
          case WebSocket.CLOSING:
            // TODO: Are we going to forcibly close the socket at any point?
            console.log("Data not sent - socket state: CLOSING");
            break;
          case WebSocket.CLOSED:
            // TODO: Control reconnection logic / may change if we go socket.io
            console.log("Data not sent - socket state: CLOSED");
            break;
        }

        sequence++;
      }
    }
  }

  return result;
};

function flushQueue(socket) {
  while (queue.length > 0) {
    sendMessage(queue.shift(), socket);
  }
}

function sendMessage(message, socket) {
  socket.emit("event", message);
}

function getValue(obj, path) {
  for (let i=0, ii=path.length; i<ii; i++){
      obj = obj[path[i]];
  }
  return obj;
}

function makeMutable(obj) {
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

function changePropertyValues(obj, key, func) {
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

function createLogEntry(action, nextState){
  let event = { ...action.meta.itsLog },
      context = { ...action };

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

  context = makeMutable(context);

  let changeSexToString = sex => sex === 0 ? "male" : "female";
  changePropertyValues(context, "sex", changeSexToString);
  changePropertyValues(context, "newSex", changeSexToString);

  const message =
    {
      event:
        {
          username: "testuser-"+session.split("-")[0],
          session: session,
          time: Date.now(),
          sequence: sequence,
          ...event,
          context: context
        }
    };
  return message;
}

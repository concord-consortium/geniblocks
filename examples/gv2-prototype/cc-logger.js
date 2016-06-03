/*
 * CC Logger
 *
 * Provides options for logging to the console and/or to one or more endpoints, such as
 * the CC Log Manager and/or the NCSU ITS server that is planned.
 *
 * cf. https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/apps/lab/controllers/log.js
 * Implemented as a wrapper component that installs the logEvent function into the context of its
 * contained child components, a la the way the router is handled in ReactRouter.
 */
import axios from 'axios';

class CCLogger extends React.Component {
  
  static propTypes = {
    // string passed to the logger as part of the event for app disambiguation
    application: React.PropTypes.string,
    // configures the logger
    config: React.PropTypes.shape({
      // whether events should be logged to the console
      console: React.PropTypes.bool,
      // support multiple endPoints, e.g. CC and NCSU
      endPoints: React.PropTypes.arrayOf(
                  // each endpoint can be independently configured
                  React.PropTypes.shape({
                    // url for server logs
                    url: React.PropTypes.string.isRequired,
                    // passed to axios as part of ajax request
                    withCredentials: React.PropTypes.bool,
                    // called on successful completion
                    onSuccess: React.PropTypes.func,
                    // called on error
                    onError: React.PropTypes.func
                  }))
    }).isRequired,
    // object which synchronizes time with server
    // cf. https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/apps/lab/lib/sync_time.js
    syncTime: React.PropTypes.object,
    // for rendering child components
    children: React.PropTypes.node
  }

  static contextTypes = {
    // session information is often given as a good use case for context
    // alternatively, perhaps it comes from Redux state
    session: React.PropTypes.object
  }

  // the type of the logEvent function
  static childContextTypes = {
    logEvent: React.PropTypes.func
  }

  // add the logEvent function to the context
  getChildContext() {
    return {
      logEvent: this.logEvent
    };
  }

  /*
   * patterned after 
   * https://github.com/concord-consortium/Geniverse-SproutCore/blob/master/apps/lab/controllers/log.js#L37-98
   */
  logEvent = (evt, params) => {

    const { application, config, syncTime } = this.props,
          { session } = this.context,
          date = syncTime ? syncTime.now() : new Date(),
          drift = syncTime ? syncTime.drift : null,
          eventData = {
            application : application,
            session     : session,
            time        : date.getTime(),
            prettyTime  : date.toString(),
            timeDrift   : drift,
            event       : evt,
            parameters  : params
          },
          strEventData = JSON.stringify(eventData);

    if (config.console) {
      console.log(strEventData);
    }

    if (config.endPoints) {
      config.endPoints.forEach(function(iEndPoint) {
        axios({
          method: 'post',
          url: iEndPoint.url,
          withCredentials: iEndPoint.withCredentials,
          data: strEventData
        })
        .then(function(iResponse) {
          if (iEndPoint.onSuccess)
            iEndPoint.onSuccess(iResponse);
        })
        .catch(function(iResponse) {
          if (iEndPoint.onError)
            iEndPoint.onError(iResponse);
        });
      });
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default CCLogger;

import Config from 'react-native-config';
import analytics from '@react-native-firebase/analytics';

export interface Logger {
  error(msg: string): void;
  warn(msg: string): void;
  info(msg: string): void;
  debug(msg: string): void;
}

class ConsoleLogger implements Logger {
  public error(msg: string): void {
    console.error(msg);
  }

  public warn(msg: string): void {
    console.warn(msg);
  }

  public info(msg: string): void {
    console.info(msg);
  }

  public debug(msg: string): void {
    console.debug(msg);
  }
}

enum LogLevel {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

class FirebaseLogger implements Logger {
  readonly EventName = 'app_log';

  public error(msg: string): void {
    this.log(LogLevel.Error, msg);
  }

  public warn(msg: string): void {
    this.log(LogLevel.Warning, msg);
  }

  public info(msg: string): void {
    this.log(LogLevel.Info, msg);
  }

  public debug(msg: string): void {
    this.log(LogLevel.Debug, msg);
  }

  private log(level: LogLevel, message: string): void {
    analytics().logEvent(this.EventName, {
      level,
      message,
    });
  }
}

const logger =
  Config.ENABLE_FIREBASE_LOGGING === 'true'
    ? new FirebaseLogger()
    : new ConsoleLogger();

export const buildLogger = (): Logger => logger;

export default logger;

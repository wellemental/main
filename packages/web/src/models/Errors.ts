class ApplicationError extends Error {
  constructor(message = 'An applicaiton error occurred.') {
    super(message);
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message = 'An authentication error occurred.') {
    super(message);
  }
}

class InvalidPromoCodeError extends ApplicationError {
  constructor(message = 'An authentication error occurred.') {
    super(message);
  }
}

class NoUserError extends AuthenticationError {
  constructor(message = 'Current user is not available.') {
    super(message);
  }
}

class InvalidPlayerProfileError extends ApplicationError {
  constructor(
    message = 'Your player profile is not setup correctly. Please try again.',
  ) {
    super(message);
  }
}

class UnimplementedError extends ApplicationError {
  constructor(message = 'This functionality has not been implemented.') {
    super(message);
  }
}

type ErrorField<T> = keyof T | 'base';

class ModelError<T> extends Error {
  private _errors: { [key: string]: string[] };

  constructor() {
    super(`Model contains errors`);
    Object.setPrototypeOf(this, ModelError.prototype);

    this._errors = {};
  }

  public addError(field: ErrorField<T>, message: string): void {
    if (field in this._errors) {
      this._errors[field as string].push(message);
    } else {
      this._errors[field as string] = [message];
    }
  }

  public fieldHasError(field: ErrorField<T>): boolean {
    return field in this._errors;
  }

  public errorsForField(field: ErrorField<T>): string[] {
    return this._errors[field as string] || [];
  }

  public hasErrors(): boolean {
    return Object.keys(this._errors).length > 0;
  }

  public errors(): string[] {
    const messages: string[] = [];
    for (const key of Object.keys(this._errors)) {
      messages.push(...this._errors[key]);
    }
    return messages;
  }
}

export {
  ApplicationError,
  AuthenticationError,
  NoUserError,
  InvalidPromoCodeError,
  UnimplementedError,
  InvalidPlayerProfileError,
  ModelError,
};

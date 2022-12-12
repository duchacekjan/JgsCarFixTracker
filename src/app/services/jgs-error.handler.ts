import {ErrorHandler, Injectable} from "@angular/core";
import {FirebaseError} from "firebase/app";

interface AngularFireError extends Error {
  rejection: FirebaseError;
}

function errorIsAngularFireError(err: any): err is AngularFireError {
  return err.rejection && err.rejection.name === 'FirebaseError';
}

// Not providedIn 'root': needs special handling in app.module to override default error handler.
@Injectable()
export class JgsErrorHandler implements ErrorHandler {
  handleError(error: any) {
    if (!errorIsAngularFireError(error)) {
      console.error(error)
    }
  }
}

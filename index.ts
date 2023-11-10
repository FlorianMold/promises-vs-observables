import './style.css';
import { Observable } from 'rxjs';

const newLine = () => console.log('');

// Eager vs lazy

/**
 * Async vs Sync
 *
 * Promise: It is eager -- It starts executing immediately once it is defined.
 * It does not matter whether we are calling the then() / catch() method.
 *
 * Observable: It is lazy -- It won't start executing until subscriber to it.
 */

function eagerVsLazy() {
  const promise = new Promise((resolve, reject) => {
    // it will be executed immediately, no matter then()/catch() is used or not.
    console.log('promise is defined');
    resolve(1);
  });

  promise.then((value) =>
    console.log(`Value emitted from Promise -- ${value}`)
  );

  const obs = new Observable((subscriber) => {
    // it will NOT be executed until we subscribe to this Observable.
    console.log('Observable is defined.');
    subscriber.next(1);
  });

  obs.subscribe((value) => {
    console.log(`Value emitted from Observable -- ${value}`);
  });

  newLine();
}
//eagerVsLazy();

/**
 * Single value vs Multiple values
 *
 * Promise: It can only return one value, it can neither resolve one value or reject
 * one value, once resolved/rejected, that's the end, we can't return anything.
 *
 * Observable: It can emit multiple streams of values, once the Observable is
 * subscribed, a stream will be open and all the emitted values will be cpatured and
 * the stream gets closed once unsubscribed.
 */
function asyncVsScync() {
  // Promises are always Async
  let prom1 = new Promise((resolve, reject) => {
    // resolving value syncchronously
    resolve(1);
  });
  prom1.then((value) => {
    console.log('resolve promise value - ', value);
  });
  console.log('call stack over');

  /**************** Observable ****************/

  // Observable can be both Sync and Async
  let obs = new Observable((subscriber) => {
    //emitting value Synchronously
    subscriber.next(1);

    setTimeout(() => {
      // emitting value Asynchronously
      subscriber.next(2);
    }, 2000);

    subscriber.next(3);
  });

  obs.subscribe((value) => {
    console.log('value emitted from obs - ', value);
  });

  // console.log('call stack over');

  newLine();
}
// asyncVsScync();

/**
 * Promises: Since promises are eager and return only one value, they will be
 * executed immediately once it is defined, so there is no way to cancel them once
 * it is defined
 *
 * Observables: Observables can be canceled (stream will be closed) by unsubscribing
 * to it
 */
function cancellableVsNonCancellable() {
  const obs = new Observable((subscriber) => {
    let i = 1;
    // value will be emitted continously for every second
    const intervalId = setInterval(() => {
      subscriber.next(i++);
    }, 1000);

    // cleanup function - will be invoked when unsubscribed
    return () => {
      console.log('unsubscribed');
      clearInterval(intervalId);
    };
  });

  const subscription = obs.subscribe((value) =>
    console.log('value emitted from obs - ', value)
  );

  setTimeout(() => {
    subscription.unsubscribe();
  }, 5000);
}
// cancellableVsNonCancellable();

/**
 * Promise: Promises are unicast, which means promises will be executed only once,
 * even if we call then() multiple times.
 *
 * Observable: Observables are multicast, which means every time we subscribe to the
 * Observable, it will be executed again and again.
 *
 */
function unicastVsMulticast() {
  /********** Promise **************/
  const prom = new Promise((resolve, _reject) => {
    console.log('promise defined');
    resolve(1);
  });

  prom.then((value) => {
    console.log('calling then 1st time - ', value);
  });

  prom.then((value) => {
    console.log('calling then 2nd time - ', value);
  });

  /************ Observable ***********/

  const obs = new Observable((subscriber) => {
    console.log('Observable defined');
    subscriber.next(1);
  });

  obs.subscribe((value) => {
    console.log('subscribing 1st time - ', value);
  });

  obs.subscribe((value) => {
    console.log('subscribing 1st time - ', value);
  });
}
// unicastVsMulticast();

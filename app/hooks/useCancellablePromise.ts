import { useRef, useEffect } from "react";

interface CancellablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export function makeCancellable<T>(promise: Promise<T>): CancellablePromise<T> {
  let isCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(val =>
        isCanceled
          ? reject(new Error(JSON.stringify({ isCanceled })))
          : resolve(val)
      )
      .catch(error =>
        isCanceled
          ? reject(new Error(JSON.stringify({ isCanceled })))
          : reject(error)
      );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    }
  };
}

export default function useCancellablePromise<T>(cancelable = makeCancellable) {
  const emptyPromise = Promise.resolve(true);

  // test if the input argument is a cancellable promise generator
  if (cancelable(emptyPromise).cancel === undefined) {
    throw new Error(
      "promise wrapper argument must provide a cancel() function"
    );
  }

  const promises = useRef<CancellablePromise<T>[]>();

  useEffect(() => {
    promises.current = promises.current || [];
    return function cancel() {
      if (promises.current) {
        promises.current.forEach(p => p.cancel());
        promises.current = [];
      }
    };
  }, []);

  function cancellablePromise(p: Promise<T>) {
    const cPromise = cancelable(p);
    if (promises.current) {
      promises.current.push(cPromise);
    }
    return cPromise.promise;
  }

  return { cancellablePromise };
}
